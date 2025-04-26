
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopTamTableProps {
  selectedState: string;
  selectedCity: string;
}

interface ZipData {
  zip: string;
  city: string;
  state_name: string;
  households: number;
  competitors: number;
  composite_score: number;
  tam: number;
  sam: number;
}

type SortField = 'zip' | 'city' | 'households' | 'competitors' | 'composite_score' | 'tam' | 'sam';
type SortDirection = 'asc' | 'desc';

const TopTamTable: React.FC<TopTamTableProps> = ({ selectedState, selectedCity }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ZipData[]>([]);
  const [sortField, setSortField] = useState<SortField>('composite_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get location data with filters
        let query = supabase
          .from("location")
          .select(`
            zip, 
            city, 
            state_name,
            population,
            Competitors
          `);
        
        if (selectedState !== "All States") {
          query = query.eq("state_name", selectedState);
        }
        
        if (selectedCity !== "All Cities") {
          query = query.eq("city", selectedCity);
        }
        
        // Limit to top results for better performance
        query = query.limit(50);

        const { data: locationData, error } = await query;
        
        if (error) {
          console.error("Error fetching location data:", error);
          setData([]);
          setLoading(false);
          return;
        }

        // Get income data for calculating TAM
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select("Zip, Households, Income_bracket")
          .in("Zip", locationData.map(loc => loc.zip));
          
        if (incomeError) {
          console.error("Error fetching income data:", incomeError);
        }
        
        // Get divorce scores
        const { data: divorceScores, error: divorceError } = await supabase
          .from("divorce_score")
          .select("Zip, scaled_composite_score")
          .in("Zip", locationData.map(loc => loc.zip));
          
        if (divorceError) {
          console.error("Error fetching divorce scores:", divorceError);
        }

        // Process and combine data
        const processedData: ZipData[] = locationData.map(location => {
          // Get all income entries for this zip
          const zipIncomes = incomeData?.filter(inc => inc.Zip === location.zip) || [];
          // Sum of all households for this zip
          const totalHouseholds = zipIncomes.reduce((sum, inc) => sum + (inc.Households || 0), 0);
          
          // Get divorce score for this zip
          const divorceScore = divorceScores?.find(ds => ds.Zip === location.zip);
          const compositeScore = divorceScore?.scaled_composite_score || 0;
          
          // Calculate TAM (Total Addressable Market) - simple example formula
          // TAM = Total Households * Average Income * Composite Score Factor
          const avgIncomeWeight = zipIncomes.length > 0 
            ? zipIncomes.reduce((sum, inc) => sum + (inc.Income_bracket || 0) * (inc.Households || 0), 0) / totalHouseholds
            : 0;
          
          const tamValue = Math.round(totalHouseholds * (avgIncomeWeight / 10000) * (compositeScore / 10));
          
          // Calculate SAM (Serviceable Available Market) - typically a percentage of TAM
          // In this example, we'll use competitor count as a factor to reduce TAM to SAM
          const competitorFactor = Math.max(0.1, 1 - ((location.Competitors || 0) * 0.1));
          const samValue = Math.round(tamValue * competitorFactor);
          
          return {
            zip: location.zip,
            city: location.city || 'Unknown',
            state_name: location.state_name,
            households: totalHouseholds,
            competitors: location.Competitors || 0,
            composite_score: compositeScore,
            tam: tamValue,
            sam: samValue
          };
        });

        // Apply sorting
        const sortedData = [...processedData].sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        setData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setLoading(false);
        setData([]);
      }
    };

    fetchData();
  }, [selectedState, selectedCity, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] cursor-pointer hover:bg-muted/70" onClick={() => handleSort('zip')}>
              <div className="flex items-center">
                ZIP <SortIcon field="zip" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('city')}>
              <div className="flex items-center">
                City <SortIcon field="city" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-muted/70" onClick={() => handleSort('households')}>
              <div className="flex items-center justify-end">
                Households <SortIcon field="households" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-muted/70" onClick={() => handleSort('competitors')}>
              <div className="flex items-center justify-end">
                Competitors <SortIcon field="competitors" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-muted/70" onClick={() => handleSort('composite_score')}>
              <div className="flex items-center justify-end">
                Composite Score <SortIcon field="composite_score" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-muted/70" onClick={() => handleSort('tam')}>
              <div className="flex items-center justify-end">
                TAM <SortIcon field="tam" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer hover:bg-muted/70" onClick={() => handleSort('sam')}>
              <div className="flex items-center justify-end">
                SAM <SortIcon field="sam" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading data...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.zip}>
                <TableCell>{row.zip}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell className="text-right">{row.households.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.competitors}</TableCell>
                <TableCell className="text-right">{row.composite_score}</TableCell>
                <TableCell className="text-right">${row.tam.toLocaleString()}</TableCell>
                <TableCell className="text-right">${row.sam.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopTamTable;
