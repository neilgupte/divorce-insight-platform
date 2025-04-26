
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDivorceData = (selectedState: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statesList, setStatesList] = useState<string[]>(['All States']);

  useEffect(() => {
    const fetchStatesList = async () => {
      try {
        const { data, error } = await supabase
          .from('location')
          .select('state')
          .eq('state', 'state') // This is a workaround since .distinct() isn't available
          .limit(1000);

        if (error) throw error;

        // Extract unique states using Set
        if (data && data.length > 0) {
          const uniqueStates = new Set<string>();
          data.forEach(item => {
            if (item.state) uniqueStates.add(item.state);
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

  return { 
    isLoading, 
    error, 
    statesList 
  };
};
