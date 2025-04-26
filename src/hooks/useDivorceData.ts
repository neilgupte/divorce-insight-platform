// src/hooks/useDivorceData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // Assuming you have Supabase set up

export const useDivorceData = (selectedState: string) => {
  const fetchHouseholdsIncome = async () => {
    const { data, error } = await supabase
      .from("households_income")
      .select("income, households, state");

    if (error) {
      console.error("Error fetching households_income:", error);
      throw new Error("Failed to fetch households income data");
    }

    if (!data) {
      return null;
    }

    // Filter by selected state if provided
    const filteredData = selectedState && selectedState !== "ALL"
      ? data.filter((row) => row.state === selectedState)
      : data;

    // Sort by income ascending (optional)
    filteredData.sort((a, b) => a.income - b.income);

    return {
      householdsIncome: filteredData,
    };
  };

  return useQuery({
    queryKey: ["householdsIncome", selectedState],
    queryFn: fetchHouseholdsIncome,
  });
};
