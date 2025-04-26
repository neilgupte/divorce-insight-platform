
// src/hooks/useDivorceData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDivorceData = (selectedState: string) => {
  const fetchDivorceData = async () => {
    const { data, error } = await supabase
      .from('your_table_name') // 🛠️ fix this
      .select('*')
      .eq('State', selectedState); // ✅ only filter by state

    if (error) {
      throw new Error('Error fetching divorce data');
    }

    return {
      householdsIncome: data?.map(item => ({
        income: item.Income_bracket,
        households: item.Households,
      })) ?? [],
    };
  };

  return useQuery({
    queryKey: ['divorce_data', selectedState],
    queryFn: fetchDivorceData,
  });
};
