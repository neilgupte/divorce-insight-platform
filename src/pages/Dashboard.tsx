
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
import MapCard from "@/components/dashboard/MapCard";

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [netWorthRange, setNetWorthRange] = useState<[number, number]>([1, 50]);
  const navigate = useNavigate();

  // Filter cities based on selected state
  const availableCities = selectedState !== "All States" && TOP_CITIES[selectedState] 
    ? TOP_CITIES[selectedState] 
    : ["All Cities"];

  // Filter data based on selections
  const filteredLuxuryLocations = TOP_LUXURY_LOCATIONS.filter(location => {
    // Filter by state
    if (selectedState !== "All States" && !location.city.includes(selectedState)) {
      return false;
    }
    
    // Filter by city
    if (selectedCity !== "All Cities" && !location.city.includes(selectedCity)) {
      return false;
    }
    
    // Filter by net worth range (assuming location.avgNetWorth is in millions)
    const netWorth = location.avgNetWorth / 1000000; // Convert to millions
    if (netWorth < netWorthRange[0] || netWorth > netWorthRange[1]) {
      return false;
    }
    
    return true;
  });

  // Transform data for regional metrics chart
  const regionData = REGIONAL_METRICS
    .filter(item => {
      // Apply net worth filter to chart data
      const netWorth = item.avgNetWorth / 1000000; // Convert to millions
      return netWorth >= netWorthRange[0] && netWorth <= netWorthRange[1];
    })
    .map(item => ({
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
        netWorthRange={netWorthRange}
        onStateChange={setSelectedState}
        onCityChange={setSelectedCity}
        onNetWorthChange={setNetWorthRange}
        availableCities={availableCities}
        usStates={US_STATES}
      />

      {/* KPI Cards */}
      <KPICards />

      {/* Main content area - first row (66/33 split) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        {/* Regional Metrics (66%) */}
        <div className="md:col-span-2">
          <RegionalMetricsChart regionData={regionData} />
        </div>

        {/* Top Luxury Locations (33%) */}
        <div className="md:col-span-1">
          <LuxuryLocationsCard 
            luxuryLocations={filteredLuxuryLocations} 
            onViewAll={handleViewAllLocations} 
          />
        </div>
      </div>

      {/* Second row - AI Insights and Map (33/66 split) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* AI Insights (33%) */}
        <div className="md:col-span-1">
          <AIInsightsCard insights={formattedInsights} />
        </div>
        
        {/* Map Card (66%) */}
        <div className="md:col-span-2">
          <MapCard 
            selectedState={selectedState !== "All States" ? selectedState : null} 
            selectedCity={selectedCity !== "All Cities" ? selectedCity : null} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
