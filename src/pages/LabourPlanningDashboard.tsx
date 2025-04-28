
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building, 
  Clock, 
  BarChart,
  Plus,
  Edit,
  Trash2,
  Eye,
  ClipboardList,
  Maximize
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FacilityMap from "@/components/labour-planning/FacilityMap";
import AIRecommendations from "@/components/labour-planning/AIRecommendations";
import { Facility } from "@/components/labour-planning/types";

// Sample data for labour models
const labourModels = [
  { 
    id: 1, 
    name: "Downtown Pharmacy", 
    location: "New York, NY", 
    createdDate: "2025-04-10", 
    totalHours: 420, 
    status: "Active",
    lastRun: "2025-04-20"
  },
  { 
    id: 2, 
    name: "Westside Pharmacy", 
    location: "Los Angeles, CA", 
    createdDate: "2025-04-05", 
    totalHours: 380, 
    status: "Active",
    lastRun: "2025-04-18"
  },
  { 
    id: 3, 
    name: "Northside Health", 
    location: "Chicago, IL", 
    createdDate: "2025-03-28", 
    totalHours: 410, 
    status: "Inactive",
    lastRun: "2025-04-15"
  },
  { 
    id: 4, 
    name: "Eastside Clinic", 
    location: "Boston, MA", 
    createdDate: "2025-03-20", 
    totalHours: 390, 
    status: "Active",
    lastRun: "2025-04-10"
  },
  { 
    id: 5, 
    name: "Central Pharmacy", 
    location: "Dallas, TX", 
    createdDate: "2025-03-15", 
    totalHours: 405, 
    status: "Under Review",
    lastRun: "2025-04-05"
  }
];

// Sample data for facility labour
const facilityLabourData: Facility[] = [
  { id: "A", name: "Facility A", lat: 40.7128, lng: -74.0060, desiredLabour: 100, currentLabour: 90, delta: 0, recommendedLabour: 110, mfx: "80/20" },
  { id: "B", name: "Facility B", lat: 34.0522, lng: -118.2437, desiredLabour: 150, currentLabour: 140, delta: -10, recommendedLabour: 140, mfx: "70/30" },
  { id: "C", name: "Facility C", lat: 41.8781, lng: -87.6298, desiredLabour: 200, currentLabour: 210, delta: 10, recommendedLabour: 200, mfx: "60/40" },
  { id: "D", name: "Facility D", lat: 42.3601, lng: -71.0589, desiredLabour: 250, currentLabour: 230, delta: 10, recommendedLabour: 260, mfx: "75/25" },
];

const LabourPlanningDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<number | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setModelToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (modelToDelete) {
      toast({
        title: "Model deleted",
        description: `Labour model has been successfully deleted.`,
      });
      setDeleteDialogOpen(false);
      setModelToDelete(null);
      // In a real application, we would remove the model from the database
    }
  };

  const handleCreateNewModel = () => {
    navigate("/labour-planning/create");
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    toast({
      title: `${facility.name} selected`,
      description: `Delta: ${facility.delta > 0 ? '+' : ''}${facility.delta}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Labour Planning Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your workforce optimization models
          </p>
        </div>
        <Button onClick={handleCreateNewModel} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create New Labour Model
        </Button>
      </div>

      {/* Map and Tables Section */}
      <div className="grid grid-cols-5 gap-6">
        {/* Map */}
        <div className="col-span-2">
          <Card className="h-[1000px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facility Map</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setFullscreenMapOpen(true)}>
                <Maximize className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              <FacilityMap 
                facilities={facilityLabourData} 
                selectedFacility={selectedFacility}
                onSelectFacility={handleFacilitySelect}
                fullscreen={false}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Tables */}
        <div className="col-span-3 space-y-6">
          {/* Top Opportunities Table */}
          <Card className="h-[500px] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle>TOP OPPORTUNITIES</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-60px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Desired Labour</TableHead>
                    <TableHead>Current Labour</TableHead>
                    <TableHead>Δ</TableHead>
                    <TableHead>Rec, Labour</TableHead>
                    <TableHead>MFX</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilityLabourData.map((facility) => (
                    <TableRow 
                      key={facility.id}
                      className={selectedFacility?.id === facility.id ? "bg-muted/50" : ""}
                      onClick={() => handleFacilitySelect(facility)}
                    >
                      <TableCell className="font-medium">{facility.id}</TableCell>
                      <TableCell>{facility.desiredLabour}</TableCell>
                      <TableCell>{facility.currentLabour}</TableCell>
                      <TableCell className={
                        facility.delta > 0 ? "text-green-600" : 
                        facility.delta < 0 ? "text-red-600" : ""
                      }>
                        {facility.delta > 0 ? "+" : ""}{facility.delta}
                      </TableCell>
                      <TableCell>{facility.recommendedLabour}</TableCell>
                      <TableCell>{facility.mfx}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="h-[240px] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-[calc(100%-60px)]">
              <AIRecommendations selectedFacility={selectedFacility} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Labour Models
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 active, 1 inactive, 1 under review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Locations
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 5 different states
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Weekly Hours per Store
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">401</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% from previous month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Labour Models</CardTitle>
          <CardDescription>
            View and manage your existing labour models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labourModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.location}</TableCell>
                  <TableCell>{model.createdDate}</TableCell>
                  <TableCell>{model.totalHours}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      model.status === "Active" ? "bg-green-100 text-green-800" : 
                      model.status === "Inactive" ? "bg-gray-100 text-gray-800" : 
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {model.status}
                    </span>
                  </TableCell>
                  <TableCell>{model.lastRun}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/labour-planning/models/${model.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/labour-planning/create/${model.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(model.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this labour model. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fullscreen Map Dialog */}
      <Dialog open={fullscreenMapOpen} onOpenChange={setFullscreenMapOpen}>
        <DialogContent className="max-w-screen-lg w-[90vw] h-[80vh] p-0">
          <div className="h-full">
            <FacilityMap 
              facilities={facilityLabourData} 
              selectedFacility={selectedFacility}
              onSelectFacility={handleFacilitySelect}
              fullscreen={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabourPlanningDashboard;
