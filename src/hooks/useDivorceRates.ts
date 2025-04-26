// src/hooks/useDivorceRates.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stateNameToAbbreviation } from "@/utils/stateMapping";

export interface DivorceRateChartData {
  year: number;
  avgState: number;    // Percent (e.g., 8.1)
  avgNational: number; // Percent (e.g., 7.4)
}

export const useDivorceRates = (selectedState: string) => {
  const fetchDivorceRates = async (): Promise<DivorceRateChartData[]> => {
    // 1. Page through the raw `divorce_rate` table
    const pageSize = 1000;
    let page = 0;
    let allRows: { Year: string; State: string; divorce_rate: string }[] = [];

    while (true) {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("divorce_rate")
        .select<{ Year: string; State: string; divorce_rate: string }>(`"Year", "State", divorce_rate`)
        .range(from, to);

      if (error) {
        console.error("Error fetching divorce_rate page", page, error);
        throw error;
      }

      if (!data || data.length === 0) break;

      allRows.push(...data);
      page++;
    }

    // 2. Clean the data
    type ZipRow = { year: number; state: string; rate: number };
    const cleaned: ZipRow[] = allRows.map((r) => ({
      year: Number(r.Year),
      state: r.State.toUpperCase(),
      rate: Number(r.divorce_rate),
    }));

    // 3. Group by year
    const grouped: Record<number, { stateRates: number[]; nationalRates: number[] }> = {};
    cleaned.forEach(({ year, rate }) => {
      if (!grouped[year]) grouped[year] = { stateRates: [], nationalRates: [] };
      grouped[year].nationalRates.push(rate);
    });

    // 4. Figure out which state to filter
    const safeKey = selectedState.trim().toUpperCase();
    const stateCode =
      safeKey === "ALL"
        ? null
        : safeKey.length === 2
        ? safeKey
        : stateNameToAbbreviation[safeKey.toLowerCase()]?.toUpperCase() ?? null;

    // 5. Add state-specific rates
    cleaned.forEach(({ year, state, rate }) => {
      if (stateCode === null || state === stateCode) {
        grouped[year].stateRates.push(rate);
      }
    });

    // 6. Build the final 2020–2023 averages
    const YEARS = [2020, 2021, 2022, 2023];
    const result: DivorceRateChartData[] = YEARS.map((year) => {
      const { stateRates = [], nationalRates = [] } = grouped[year] || {};
      const avg = (arr: number[]) =>
        arr.length > 0
          ? Number(((arr.reduce((a, b) => a + b, 0) / arr.length) * 100).toFixed(1))
          : 0;
      return {
        year,
        avgState: avg(stateRates),
        avgNational: avg(nationalRates),
      };
    });

    return result;
  };

  return useQuery({
    queryKey: ["divorce_rates", selectedState],
    queryFn: fetchDivorceRates,
  });
};
