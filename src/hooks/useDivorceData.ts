// src/hooks/useDivorceData.ts

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDivorceData = (selectedState: string) => {
  const fetchHouseholdsIncome = async () => {
    const safeState = selectedState.trim().toUpperCase();

    // Fetch from the correct table
    const { data, error } = await supabase
      .from('income') // ✅ correct table
      .select('Income_bracket, Households, State') // ✅ correct fields
      .eq('State', safeState); // ✅ match by State exactly

    if (error) {
      console.error("Error fetching households income:", error);
      throw error;
    }

    if (!data || data.length === 0) return { householdsIncome: [] };

    // Group data by Income_bracket (sum households if duplicates exist)
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
