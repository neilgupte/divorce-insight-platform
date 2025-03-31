import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { US_STATES, TOP_CITIES } from "@/data/mockData";
import { 
  FileText,
  File,
  Save,
  Calendar,
  Share,
  Check,
  Clock,
  BarChart3,
  Map,
  Home,
  Building,
  User,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const REPORT_TYPES = [
  {
    id: "overview",
    name: "Market Overview",
    description: "General market insights for high-net-worth divorce cases",
    icon: BarChart3,
  },
  {
    id: "location",
    name: "Location Analysis",
    description: "In-depth analysis of a specific location",
    icon: Map,
  },
  {
    id: "property",
    name: "Property Portfolio",
    description: "Luxury real estate and property distribution analysis",
    icon: Home,
  },
  {
    id: "assets",
    name: "Asset Distribution",
    description: "High-value asset distribution patterns and insights",
    icon: Building,
  },
];

const AUDIENCES = [
  {
    id: "attorney",
    name: "Attorney",
    description: "Legal analysis with case precedents and jurisdiction specifics",
  },
  {
    id: "founder",
    name: "Firm Founder/Partner",
    description: "Executive summary with business development insights",
  },
  {
    id: "marketing",
    name: "Marketing Team",
    description: "Market positioning data and client acquisition insights",
  },
];

const TIME_PERIODS = [
  { id: "1y", name: "Past Year" },
  { id: "2y", name: "Past 2 Years" },
  { id: "5y", name: "Past 5 Years" },
  { id: "10y", name: "Past 10 Years" },
  { id: "custom", name: "Custom Date Range" },
];

const SCHEDULE_OPTIONS = [
  { id: "once", name: "One-time" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
  { id: "quarterly", name: "Quarterly" },
];

const reportTemplates = [
  {
    id: "template-1",
    name: "Comprehensive Location Analysis",
    type: "location",
    description: "Full breakdown of divorce patterns with luxury property insights",
    lastUsed: "2023-11-28",
  },
  {
    id: "template-2",
    name: "Executive Summary Dashboard",
    type: "overview",
    description: "High-level metrics for firm partners and executives",
    lastUsed: "2023-12-01",
  },
  {
    id: "template-3",
    name: "Asset Protection Strategy",
    type: "assets",
    description: "Analysis of asset protection patterns pre-divorce",
    lastUsed: "2023-10-15",
  },
];

const ReportGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>("overview");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [audience, setAudience] = useState<string>("attorney");
  const [timePeriod, setTimePeriod] = useState<string>("1y");
  const [customDateStart, setCustomDateStart] = useState<string>("");
  const [customDateEnd, setCustomDateEnd] = useState<string>("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "divorce-rate",
    "net-worth",
    "property-density",
  ]);
  const [scheduleOption, setScheduleOption] = useState<string>("once");
  const [generateInProgress, setGenerateInProgress] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? ["All Cities", ...TOP_CITIES[selectedState]] 
    : ["All Cities"];

  const metrics = [
    { id: "divorce-rate", label: "Divorce Rate" },
    { id: "net-worth", label: "Average Net Worth" },
    { id: "property-density", label: "Luxury Property Density" },
    { id: "multi-property", label: "Multi-Property Households" },
    { id: "exclusive-clubs", label: "Exclusive Club Memberships" },
    { id: "private-transport", label: "Private Transportation Access" },
    { id: "high-end-retail", label: "High-End Retail Presence" },
    { id: "asset-protection", label: "Asset Protection Patterns" },
    { id: "international-holdings", label: "International Holdings" },
  ];

  const handleMetricToggle = (id: string) => {
    if (selectedMetrics.includes(id)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== id));
    } else {
      setSelectedMetrics([...selectedMetrics, id]);
    }
  };

  const handleGenerateReport = () => {
    setGenerateInProgress(true);
    
    setTimeout(() => {
      setGenerateInProgress(false);
      setReportGenerated(true);
      toast({
        title: "Report generated successfully",
        description: "Your PDF report is ready to download",
      });
    }, 2000);
  };

  const handleSaveReport = () => {
    toast({
      title: "Report saved",
      description: "Your report has been saved to the document vault",
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Report scheduled",
      description: `Your report will be generated ${scheduleOption === "once" ? "once" : scheduleOption + "ly"}`,
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Report shared",
      description: "Your report has been shared with the team",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report Generator</h1>
        <p className="text-muted-foreground">
          Create custom reports based on location and metrics
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Report</TabsTrigger>
          <TabsTrigger value="templates">Saved Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>
                  Customize your report parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Report Type</h3>
                  <RadioGroup value={reportType} onValueChange={setReportType} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {REPORT_TYPES.map((type) => (
                      <Label
                        key={type.id}
                        htmlFor={type.id}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-4 ${
                          reportType === type.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                          <type.icon className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm font-medium">{type.name}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                        {reportType === type.id && <Check className="h-4 w-4 text-primary" />}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Location</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All States">All States</SelectItem>
                          {US_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Time Period</h3>
                  <RadioGroup value={timePeriod} onValueChange={setTimePeriod} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {TIME_PERIODS.map((period) => (
                      <Label
                        key={period.id}
                        htmlFor={period.id}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-2 ${
                          timePeriod === period.id ? "border-primary" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={period.id} id={period.id} className="sr-only" />
                          <span className="text-xs font-medium">{period.name}</span>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                  
                  {timePeriod === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input 
                          id="start-date" 
                          type="date" 
                          value={customDateStart}
                          onChange={(e) => setCustomDateStart(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input 
                          id="end-date" 
                          type="date" 
                          value={customDateEnd}
                          onChange={(e) => setCustomDateEnd(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Metrics to Include</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={metric.id} 
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => handleMetricToggle(metric.id)}
                        />
                        <label
                          htmlFor={metric.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {metric.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Target Audience</h3>
                  <RadioGroup value={audience} onValueChange={setAudience} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {AUDIENCES.map((item) => (
                      <Label
                        key={item.id}
                        htmlFor={item.id}
                        className={`flex cursor-pointer flex-col rounded-md border p-4 ${
                          audience === item.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <RadioGroupItem value={item.id} id={item.id} className="sr-only" />
                        <span className="font-medium">{item.name}</span>
                        <span className="mt-1 text-xs text-muted-foreground">{item.description}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Template</Button>
                <Button onClick={handleGenerateReport} disabled={generateInProgress}>
                  {generateInProgress ? (
                    <>
                      <span className="mr-2">Generating...</span>
                      <Clock className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span className="mr-2">Generate Report</span>
                      <FileText className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>
                    Generated PDF preview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportGenerated ? (
                    <div className="flex flex-col items-center space-y-4">
                      <File className="h-16 w-16 text-primary" />
                      <div className="text-center">
                        <p className="font-medium">Report Ready</p>
                        <p className="text-xs text-muted-foreground">Your report has been generated successfully</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        <span className="mr-2">Download PDF</span>
                        <File className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 p-8">
                      <FileText className="h-16 w-16 text-muted-foreground/30" />
                      <p className="text-center text-sm text-muted-foreground">
                        Generate a report to see preview
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {reportGenerated && (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={handleSaveReport}>
                      <Save className="mr-2 h-4 w-4" />
                      Save to Document Vault
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleScheduleReport}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Regular Report
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleShareReport}>
                      <Share className="mr-2 h-4 w-4" />
                      Share Internally
                    </Button>
                  </CardContent>
                </Card>
              )}

              {reportGenerated && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={scheduleOption} onValueChange={setScheduleOption}>
                      {SCHEDULE_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`schedule-${option.id}`} />
                          <Label htmlFor={`schedule-${option.id}`}>{option.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button size="sm" className="w-full">
                      Set Schedule
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    {template.type === "location" && <Map className="h-5 w-5 text-muted-foreground" />}
                    {template.type === "overview" && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
                    {template.type === "assets" && <Building className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{template.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last used:</span>
                      <span>{template.lastUsed}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button size="sm">Use Template</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportGenerator;
