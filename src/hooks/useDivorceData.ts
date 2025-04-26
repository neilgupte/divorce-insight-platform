import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stateNameToAbbreviation } from "@/utils/stateMapping";

export const useDivorceData = (selectedState: string) => {
  return useQuery(['divorce-data', selectedState], async () => {
    if (!selectedState) return null;

    let query = supabase.from('divorce_rate').select('Year, State, Divorce Rate');

    if (selectedState !== 'All States') {
      const abbrev = stateNameToAbbreviation[selectedState.toLowerCase()];
      query = query.eq('State', abbrev);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    if (!data) return null;

    // Group by year
    const grouped: Record<number, number[]> = {};

    data.forEach((row) => {
      if (!row.Year || !row["Divorce Rate"]) return;
      const year = parseInt(row.Year);
      const rate = typeof row["Divorce Rate"] === "string" 
        ? parseFloat(row["Divorce Rate"].replace("%", "")) 
        : Number(row["Divorce Rate"]);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(rate);
    });

    const years = Object.keys(grouped).map(Number).sort();
    
    const stateAverage = years.map((year) => ({
      year,
      rate: grouped[year] && grouped[year].length > 0
        ? Number((grouped[year].reduce((a, b) => a + b, 0) / grouped[year].length).toFixed(2))
        : 0,
    }));

    const allRates = Object.values(grouped).flat();
    const nationalAverageRate = allRates.length > 0
      ? Number((allRates.reduce((a, b) => a + b, 0) / allRates.length).toFixed(2))
      : 0;

    const nationalAverage = years.map((year) => ({
      year,
      rate: nationalAverageRate,
    }));

    return {
      divorceRates: {
        stateAverage,
        nationalAverage,
      },
      householdsIncome: [] // We'll fill this later
    };
  }, {
    keepPreviousData: true,
  });
};
