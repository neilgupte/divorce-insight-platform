import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stateNameToAbbreviation } from "@/lib/stateMapping"; // <-- double check this path

export const useDivorceRates = (selectedState: string) => {
  const fetchDivorceRates = async () => {
    const pageSize = 1000;
    let page = 0;
    let allRows: any[] = [];

    while (true) {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from("divorce_rate")
        .select(`"Year", "State", divorce_rate`)
        .range(from, to);

      if (error) {
        console.error("Error fetching divorce_rate page", page, error);
        throw error;
      }
      if (!data || data.length === 0) break;
      allRows.push(...data);
      page++;
    }

    const cleaned = allRows.map((r) => ({
      year: Number(r.Year),
      state: r.State.toUpperCase(),
      rate: Number(r.divorce_rate),
    }));

    const grouped: any = {};

    cleaned.forEach(({ year, rate }) => {
      if (!grouped[year]) grouped[year] = { stateRates: [], nationalRates: [] };
      grouped[year].nationalRates.push(rate);
    });

    const safeKey = selectedState.trim().toUpperCase();
    const stateCode =
      safeKey === "ALL"
        ? null
        : safeKey.length === 2
        ? safeKey
        : stateNameToAbbreviation[safeKey.toLowerCase()]?.toUpperCase() ?? null;

    cleaned.forEach(({ year, state, rate }) => {
      if (stateCode === null || state === stateCode) {
        grouped[year].stateRates.push(rate);
      }
    });

    const YEARS = [2020, 2021, 2022, 2023];
    const result = YEARS.map((year) => {
      const { stateRates = [], nationalRates = [] } = grouped[year] || {};
      const avg = (arr: number[]) =>
        arr.length > 0
          ? Number((arr.reduce((a, b) => a + b, 0) / arr.length * 100).toFixed(1))
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
    queryKey: ['divorce_rates', selectedState],
    queryFn: fetchDivorceRates,
  });
};
