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
        .from("households_income")
        .select(`income, households`)
        .range(from, to);

      if (error) {
        console.error("Error fetching households_income page", page, error);
        throw error;
      }

      if (!data || data.length === 0) break;

      allRows.push(...data);
      page++;
    }

    // Clean and sort the data
    const cleaned = allRows
      .map((r) => ({
        income: Number(r.income),
        households: Number(r.households),
      }))
      .sort((a, b) => a.income - b.income);

    return { householdsIncome: cleaned };
  };

  return useQuery({
    queryKey: ["households_income", selectedState],
    queryFn: fetchHouseholdsIncome,
  });
};
