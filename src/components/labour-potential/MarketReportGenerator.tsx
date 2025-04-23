
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";

interface MarketReportGeneratorProps {
  location: string | null;
}

const MarketReportGenerator = ({ location }: MarketReportGeneratorProps) => {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [reportItems, setReportItems] = useState({
    supplyDemand: true,
    wageStats: true,
    localCompetition: true,
    demographicData: false,
    transportAccess: false
  });

  const handleCheckboxChange = (id: keyof typeof reportItems) => {
    setReportItems({
      ...reportItems,
      [id]: !reportItems[id]
    });
  };

  const handleDownload = () => {
    // In a real app, this would trigger an API call to generate the report
    console.log(`Downloading ${selectedFormat} report for ${location}`);
    console.log("Report includes:", Object.entries(reportItems)
      .filter(([_, value]) => value)
      .map(([key]) => key)
    );
  };

  const handleAttach = () => {
    // In a real app, this would attach to a site proposal
    console.log(`Attaching report to site proposal for ${location}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Labour Market Report</h1>
          <p className="text-muted-foreground">{location || "No location selected"}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Format</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pdf">PDF Document</TabsTrigger>
              <TabsTrigger value="excel">Excel Spreadsheet</TabsTrigger>
              <TabsTrigger value="csv">CSV Raw Data</TabsTrigger>
            </TabsList>
            <TabsContent value="pdf" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Full report with visualizations, insights, and formatted data tables. 
                Best for presentations and sharing with stakeholders.
              </p>
            </TabsContent>
            <TabsContent value="excel" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Interactive Excel workbook with data sheets, pivot tables, and customizable charts.
                Best for further analysis and data manipulation.
              </p>
            </TabsContent>
            <TabsContent value="csv" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Raw comma-separated values format for importing into other tools.
                Best for data integration with other systems.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="supplyDemand" 
                checked={reportItems.supplyDemand}
                onCheckedChange={() => handleCheckboxChange("supplyDemand")}
              />
              <Label htmlFor="supplyDemand" className="text-base">Supply vs. Demand Chart</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="wageStats" 
                checked={reportItems.wageStats}
                onCheckedChange={() => handleCheckboxChange("wageStats")}
              />
              <Label htmlFor="wageStats" className="text-base">Wage Statistics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="localCompetition" 
                checked={reportItems.localCompetition}
                onCheckedChange={() => handleCheckboxChange("localCompetition")}
              />
              <Label htmlFor="localCompetition" className="text-base">Local Risks Assessment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="demographicData" 
                checked={reportItems.demographicData}
                onCheckedChange={() => handleCheckboxChange("demographicData")}
              />
              <Label htmlFor="demographicData" className="text-base">Demographic Data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="transportAccess" 
                checked={reportItems.transportAccess}
                onCheckedChange={() => handleCheckboxChange("transportAccess")}
              />
              <Label htmlFor="transportAccess" className="text-base">Transport Access Analysis</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-[200px] rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Preview of selected report format and sections</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleAttach}>
          <FileText className="mr-2 h-4 w-4" />
          Attach to Site Proposal
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default MarketReportGenerator;
