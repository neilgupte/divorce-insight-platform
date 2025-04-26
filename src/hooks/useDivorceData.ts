
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HouseholdIncomeData {
  income: number;
  households: number;
}

interface DivorceDataResult {
  isLoading: boolean;
  error: Error | null;
  statesList: string[];
  householdsIncome?: HouseholdIncomeData[];
}

export const useDivorceData = (selectedState: string): DivorceDataResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statesList, setStatesList] = useState<string[]>(['All States']);
  const [householdsIncome, setHouseholdsIncome] = useState<HouseholdIncomeData[]>([]);

  // Fetch the states list
  useEffect(() => {
    const fetchStatesList = async () => {
      try {
        const { data, error } = await supabase
          .from('location')
          .select('state_name')
          .limit(1000);

        if (error) throw error;

        // Extract unique states using Set
        if (data && data.length > 0) {
          const uniqueStates = new Set<string>();
          data.forEach(item => {
            if (item.state_name) uniqueStates.add(item.state_name);
          });
          
          const formattedStates = ['All States', ...Array.from(uniqueStates).sort()];
          setStatesList(formattedStates);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatesList();
  }, []);

  // Fetch household income data
  useEffect(() => {
    const fetchHouseholdIncomeData = async () => {
      try {
        setIsLoading(true);
        
        // Build query based on state selection
        let query = supabase
          .from('income')
          .select('Income_bracket, Households')
          .order('Income_bracket');

        // Apply state filter if not "All States"
        if (selectedState !== 'All States') {
          query = query.eq('State', selectedState);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          const formattedData = data.map(item => ({
            income: Number(item.Income_bracket),
            households: Number(item.Households)
          }));
          
          setHouseholdsIncome(formattedData);
        }
      } catch (err) {
        console.error('Error fetching household income data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouseholdIncomeData();
  }, [selectedState]);

  return { 
    isLoading, 
    error, 
    statesList,
    householdsIncome
  };
};
