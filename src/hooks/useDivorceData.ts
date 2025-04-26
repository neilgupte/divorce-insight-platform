// src/hooks/useDivorceData.ts

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDivorceData = (selectedState: string) => {
  const fetchHouseholdsIncome = async () => {
    const safeState = selectedState.trim().toUpperCase();

    const { data, error } = await supabase
      .from('income')
      .select('Income_bracket, Households, State')
      .eq('State', safeState);

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("Error fetching households income:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`No data found for state: ${safeState}`);
      return { householdsIncome: [] };
    }

    const incomeMap: Record<number, number> = {};

    data.forEach((row) => {
      const income = row.Income_bracket;
      const households = row.Households;
      if (income !== null && households !== null) {
        incomeMap[income] = (incomeMap[income] || 0) + households;
      }
    });

    const householdsIncome = Object.entries(incomeMap)
      .map(([income, households]) => ({
        income: Number(income),
        households: Number(households),
      }))
      .sort((a, b) => a.income - b.income);

    return { householdsIncome };
  };

  return useQuery({
    queryKey: ["households_income", selectedState],
    queryFn: fetchHouseholdsIncome,
  });
};
