
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, CalendarIcon, TrendingUpIcon, BarChartIcon, LineChartIcon } from "lucide-react";

const LabourPlanningDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Labour Planning Dashboard</h1>
          <p className="text-muted-foreground">
            Workforce optimization and resource allocation insights
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from previous month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">
              +3.1% from previous month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from previous month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Workforce Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChartIcon className="mx-auto h-12 w-12 mb-4" />
              <p>Workforce distribution visualization will appear here</p>
              <Button variant="outline" className="mt-4">View Details</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChartIcon className="mx-auto h-12 w-12 mb-4" />
              <p>Resource allocation visualization will appear here</p>
              <Button variant="outline" className="mt-4">View Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Schedule Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Q3 Resource Allocation Update</p>
                  <p className="text-sm text-muted-foreground">Staffing adjustments for Q3 goals</p>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">Aug 15</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Peak Season Preparation</p>
                  <p className="text-sm text-muted-foreground">Temporary workforce scaling</p>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">Sep 01</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Skills Gap Analysis</p>
                  <p className="text-sm text-muted-foreground">Departmental training needs assessment</p>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">Sep 15</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UsersIcon className="mr-2 h-4 w-4" />
                View Staff Directory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Productivity Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChartIcon className="mr-2 h-4 w-4" />
                Resource Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabourPlanningDashboard;
