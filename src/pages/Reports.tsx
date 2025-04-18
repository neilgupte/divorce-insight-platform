
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart } from "@/components/ui/chart";

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Labour Reports</h1>
      </div>

      <Tabs defaultValue="labor">
        <TabsList>
          <TabsTrigger value="labor">Labour Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="labor" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Labour Hours by Department</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Kitchen", hours: 1420 },
                    { name: "Service", hours: 1850 },
                    { name: "Management", hours: 680 },
                    { name: "Cleaning", hours: 520 },
                  ]}
                  index="name"
                  categories={["hours"]}
                  colors={["purple"]}
                  yAxisWidth={48}
                  showLegend={false}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Labour Cost Trends</CardTitle>
                <CardDescription>Last 12 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={[
                    { week: "Week 1", cost: 12500 },
                    { week: "Week 2", cost: 11800 },
                    { week: "Week 3", cost: 13200 },
                    { week: "Week 4", cost: 14100 },
                    { week: "Week 5", cost: 12900 },
                    { week: "Week 6", cost: 13500 },
                    { week: "Week 7", cost: 14500 },
                    { week: "Week 8", cost: 13900 },
                    { week: "Week 9", cost: 14200 },
                    { week: "Week 10", cost: 13700 },
                    { week: "Week 11", cost: 14100 },
                    { week: "Week 12", cost: 14800 },
                  ]}
                  index="week"
                  categories={["cost"]}
                  colors={["purple"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  showLegend={false}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Hours per Location</CardTitle>
                <CardDescription>Comparison by location and department</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { location: "Downtown", kitchen: 520, service: 680, management: 180 },
                    { location: "Westside", kitchen: 420, service: 580, management: 160 },
                    { location: "Airport", kitchen: 480, service: 590, management: 140 },
                    { location: "Eastside", kitchen: 380, service: 450, management: 120 },
                  ]}
                  index="location"
                  categories={["kitchen", "service", "management"]}
                  colors={["purple", "violet", "indigo"]}
                  stack={true}
                  valueFormatter={(value) => `${value} hrs`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metrics</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Detailed efficiency metrics will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasts">
          <Card>
            <CardHeader>
              <CardTitle>Labour Forecasts</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Advanced forecasting tools will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
