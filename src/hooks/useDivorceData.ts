
import { useState, useEffect } from 'react';

// This would normally come from your Supabase client
// For now, we'll use mock data until Supabase is connected
const statesList = [
  "All States",
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", 
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", 
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", 
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", 
  "Wyoming"
];

export const useDivorceData = (selectedState: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This would be a Supabase query in the real implementation
        // const { data, error } = await supabase
        //   .from('divorce_data')
        //   .select('*')
        //   .eq('state', selectedState);
        
        // if (error) throw new Error(error.message);

        // Mock data for now
        const mockData = {
          divorceRates: {
            stateAverage: [
              { year: 2020, rate: 7.8 },
              { year: 2021, rate: 8.0 },
              { year: 2022, rate: 8.0 },
              { year: 2023, rate: 8.0 }
            ],
            nationalAverage: [
              { year: 2020, rate: 6.4 },
              { year: 2021, rate: 6.5 },
              { year: 2022, rate: 6.5 },
              { year: 2023, rate: 6.5 }
            ]
          },
          householdsIncome: [
            { income: 12500, households: 18000 },
            { income: 22500, households: 19000 },
            { income: 32500, households: 19500 },
            { income: 42500, households: 19500 },
            { income: 55000, households: 20000 },
            { income: 67500, households: 30000 },
            { income: 87500, households: 22000 },
            { income: 112500, households: 24000 }
          ]
        };

        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching divorce data:', err);
        setError('Failed to load data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedState]);

  return { data, isLoading, error, statesList };
};
