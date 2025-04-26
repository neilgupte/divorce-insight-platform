// src/hooks/useDivorceData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDivorceData = (selectedState: string) => {
  const fetchHouseholdsIncome = async () => {
    const pageSize = 1000;
    let page = 0;
    let allRows: any[] = [];

    while (true) {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("households_income") // Make sure this is your real table name
        .select(`Income_bracket, Households`)
        .range(from, to);

      if (error) {
        console.error("Error fetching households_income page", page, error);
        throw error;
      }

      if (!data || data.length === 0) break;

      allRows.push(...data);
      page++;
    }

    const cleaned = allRows
      .filter((r) => r.Households > 0) // remove empty rows (like your 0 households for 32072)
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
