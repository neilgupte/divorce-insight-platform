
import React from "react";
import { X, Building, Home, DollarSign, Map, Users, Briefcase } from "lucide-react";
import { ZIPCodeData } from "@/lib/zipUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ZIPCodeDetailOverlayProps {
  zipCodeData: ZIPCodeData;
  onClose: () => void;
}

const ZIPCodeDetailOverlay: React.FC<ZIPCodeDetailOverlayProps> = ({
  zipCodeData,
  onClose
}) => {
  // Format currency values
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  // Get opportunity color based on rating
  const getOpportunityColor = (): string => {
    if (!zipCodeData.opportunity) return 'bg-orange-500';
    
    if (zipCodeData.opportunity >= 10) return 'bg-red-500';
    if (zipCodeData.opportunity >= 5) return 'bg-orange-500';
    return 'bg-amber-400';
  };

  const getOpportunityRating = (): 'High' | 'Medium' | 'Low' => {
    if (!zipCodeData.opportunity) return 'Medium';
    
    if (zipCodeData.opportunity >= 10) return 'High';
    if (zipCodeData.opportunity >= 5) return 'Medium';
    return 'Low';
  };

  const opportunityRating = getOpportunityRating();

  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0D1117] text-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[#0D1117] border-b border-gray-800">
        <div className="p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              ZIP Code Overview – {zipCodeData.zipCode}
              <Badge className="ml-2 bg-red-600 hover:bg-red-700" variant="default">
                Opportunity - {opportunityRating}
              </Badge>
            </h2>
            <p className="text-gray-400">{zipCodeData.city}, {zipCodeData.state}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Map className="mr-2 h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold">ZIP Summary</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Total Addressable Market</p>
              <p className="text-lg font-bold">${Math.round((zipCodeData.opportunity || 10) * 2.5)}M</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Serviceable Market</p>
              <p className="text-lg font-bold">${Math.round((zipCodeData.opportunity || 10) * 1.5)}M</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Divorce Rate</p>
              <p className="text-lg font-bold">{(zipCodeData.divorceRate * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Avg. Net Worth</p>
              <p className="text-lg font-bold">${(zipCodeData.netWorth || 2.8).toFixed(1)}M</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Net Worth Bracket</p>
              <p className="text-lg font-bold">$10M-$50M</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">$ Opportunity</p>
              <p className="text-lg font-bold text-red-500">${(zipCodeData.opportunity || 10).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Building className="mr-2 h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Competitor Intelligence</h3>
          </div>

          <div className="bg-[#131C2E] rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1A2333]">
                <tr>
                  <th className="py-2 px-3 text-left text-xs text-gray-400 font-medium">Business Name</th>
                  <th className="py-2 px-3 text-left text-xs text-gray-400 font-medium">Principal</th>
                  <th className="py-2 px-3 text-left text-xs text-gray-400 font-medium">Address</th>
                  <th className="py-2 px-3 text-left text-xs text-gray-400 font-medium">Size</th>
                  <th className="py-2 px-3 text-left text-xs text-gray-400 font-medium">Years Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-[#1C2539]">
                  <td className="py-2 px-3">Elite Divorce Partners LLC</td>
                  <td className="py-2 px-3">Alexandra Morgan, Esq.</td>
                  <td className="py-2 px-3">123 Wealth St, {zipCodeData.city}, {zipCodeData.state} {zipCodeData.zipCode}</td>
                  <td className="py-2 px-3">Large (25+ attorneys)</td>
                  <td className="py-2 px-3">15</td>
                </tr>
                <tr className="hover:bg-[#1C2539]">
                  <td className="py-2 px-3">Highworth Family Law Group</td>
                  <td className="py-2 px-3">Jonathan Wells, Esq.</td>
                  <td className="py-2 px-3">456 Fortune Ave, {zipCodeData.city}, {zipCodeData.state} {zipCodeData.zipCode}</td>
                  <td className="py-2 px-3">Medium (10-24 attorneys)</td>
                  <td className="py-2 px-3">8</td>
                </tr>
                <tr className="hover:bg-[#1C2539]">
                  <td className="py-2 px-3">Prestige Matrimonial Solutions</td>
                  <td className="py-2 px-3">Victoria Reynolds, Esq.</td>
                  <td className="py-2 px-3">789 Luxury Blvd, {zipCodeData.city}, {zipCodeData.state} {zipCodeData.zipCode}</td>
                  <td className="py-2 px-3">Small (2-9 attorneys)</td>
                  <td className="py-2 px-3">12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Users className="mr-2 h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold">HNW Household Metrics</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Total HNW Households</p>
              <p className="text-lg font-bold">280</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Multi-Property Households</p>
              <p className="text-lg font-bold">68%</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Avg. Properties/Household</p>
              <p className="text-lg font-bold">3.4</p>
            </div>
            <div className="bg-[#131C2E] p-3 rounded-md">
              <p className="text-xs text-gray-400 mb-1">Asset Protection Entities</p>
              <p className="text-lg font-bold">76%</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full bg-red-700 hover:bg-red-800">Analyze This ZIP Code</Button>
        </div>
      </div>
    </div>
  );
};

export default ZIPCodeDetailOverlay;
