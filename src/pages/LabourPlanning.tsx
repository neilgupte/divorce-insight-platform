
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LabourPlanningDashboard from "@/components/labour-planning/LabourPlanningDashboard";
import LabourPlanningData from "@/components/labour-planning/LabourPlanningData";
import LabourPlanningSettings from "@/components/labour-planning/LabourPlanningSettings";

const LabourPlanning = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Labour Planning</h1>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <LabourPlanningDashboard />
        </TabsContent>
        <TabsContent value="data">
          <LabourPlanningData />
        </TabsContent>
        <TabsContent value="settings">
          <LabourPlanningSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabourPlanning;
