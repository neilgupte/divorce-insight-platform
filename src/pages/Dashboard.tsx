
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  REGIONAL_METRICS, 
  TOP_LUXURY_LOCATIONS, 
  AI_INSIGHTS, 
  US_STATES, 
  TOP_CITIES, 
  NET_WORTH_BRACKETS 
} from "@/data/mockData";

// Import our components
import KPICards from "@/components/dashboard/KPICards";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import RegionalMetricsChart from "@/components/dashboard/RegionalMetricsChart";
import LuxuryLocationsCard from "@/components/dashboard/LuxuryLocationsCard";
import AIInsightsCard from "@/components/dashboard/AIInsightsCard";
import DummyMapCard from "@/components/dashboard/DummyMapCard";

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedNetWorth, setSelectedNetWorth] = useState<string>("All");
  const navigate = useNavigate();

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? ["All Cities", ...TOP_CITIES[selectedState]] 
    : ["All Cities"];

  // Filter data based on selections
  const filteredLuxuryLocations = TOP_LUXURY_LOCATIONS.filter(location => {
    if (selectedState !== "All States" && !location.city.includes(selectedState)) {
      return false;
    }
    if (selectedCity !== "All Cities" && !location.city.includes(selectedCity)) {
      return false;
    }
    return true;
  });

  // Transform data for regional metrics chart
  const regionData = REGIONAL_METRICS.map(item => ({
    name: item.region,
    netWorth: item.avgNetWorth / 1000000, // Convert to millions
    divorceRate: item.divorceRate,
    luxuryDensity: item.luxuryDensity
  }));

  // Convert AI insights data to use string IDs
  const formattedInsights = AI_INSIGHTS.map(insight => ({
    ...insight,
    id: String(insight.id)
  }));

  const handleViewAllLocations = () => {
    navigate("/location", { state: { fromDashboard: true } });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of high-net-worth divorce metrics across the United States
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters 
        selectedState={selectedState}
        selectedCity={selectedCity}
        selectedNetWorth={selectedNetWorth}
        onStateChange={setSelectedState}
        onCityChange={setSelectedCity}
        onNetWorthChange={setSelectedNetWorth}
        availableCities={availableCities}
        usStates={US_STATES}
        netWorthBrackets={NET_WORTH_BRACKETS}
      />

      {/* KPI Cards */}
      <KPICards />

      {/* Main content area - first row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
        {/* Regional Metrics */}
        <RegionalMetricsChart regionData={regionData} />

        {/* Top Luxury Locations */}
        <LuxuryLocationsCard 
          luxuryLocations={filteredLuxuryLocations} 
          onViewAll={handleViewAllLocations} 
        />
      </div>

      {/* Second row - Map and AI Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Map Card */}
        <DummyMapCard 
          selectedState={selectedState} 
          selectedCity={selectedCity} 
        />
        
        {/* AI Insights */}
        <AIInsightsCard insights={formattedInsights} />
      </div>
    </div>
  );
};

export default Dashboard;
