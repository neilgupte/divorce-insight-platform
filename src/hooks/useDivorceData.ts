
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDivorceData = (selectedState: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statesList, setStatesList] = useState<string[]>(['All States']);

  useEffect(() => {
    const fetchStatesList = async () => {
      try {
        const { data: states, error } = await supabase
          .from('location')
          .select('state')
          .distinct();

        if (error) throw error;

        const formattedStates = ['All States', ...states.map(state => state.state).sort()];
        setStatesList(formattedStates);
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
