
// src/hooks/useDivorceData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDivorceData = (selectedState: string) => {
  const fetchHouseholdsIncome = async () => {
    let query = supabase
      .from("income")
      .select(`Income_bracket, Households, State`);
    
    if (selectedState !== "All States") {
      query = query.eq("State", selectedState);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching income data:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { householdsIncome: [] };
    }

    const cleaned = data
      .filter((r) => r.Households > 0) // remove empty rows
      .map((r) => ({
        income: Number(r.Income_bracket),
        households: Number(r.Households),
      }))
      .sort((a, b) => a.income - b.income);

    return { householdsIncome: cleaned };
  };

  return useQuery({
    queryKey: ["households_income", selectedState],
    queryFn: fetchHouseholdsIncome,
  });
};
