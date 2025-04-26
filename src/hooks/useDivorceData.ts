import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HouseholdData {
  income: number;
  households: number;
}

const stateNameToAbbreviation: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  New Hampshire: 'NH',
  New Jersey: 'NJ',
  New Mexico: 'NM',
  New York: 'NY',
  North Carolina: 'NC',
  North Dakota: 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  Rhode Island: 'RI',
  South Carolina: 'SC',
  South Dakota: 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  West Virginia: 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  DistrictOfColumbia: 'DC',
};

export const useDivorceData = (selectedState: string) => {
  const fetchDivorceData = async (): Promise<{ householdsIncome: HouseholdData[] }> => {
    console.log('Selected state:', selectedState);

    if (!selectedState) {
      console.warn('No selectedState provided to useDivorceData');
      return { householdsIncome: [] };
    }

    const safeKey = selectedState.trim();
    const lookupKey = safeKey.replace(/\s/g, '').toLowerCase(); // e.g., "New York" → "newyork"
    const stateCode = stateNameToAbbreviation[lookupKey.charAt(0).toUpperCase() + lookupKey.slice(1)] ?? stateNameToAbbreviation[safeKey] ?? safeKey.toUpperCase();

    const { data, error } = await supabase
      .from('divorce_rate') // <---- Check this is your table
      .select('Income_bracket, Households, State')
      .eq('State', stateCode);

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      throw new Error('Failed to fetch data');
    }

    console.log('Fetched data:', data);

    const householdsIncome = (data || [])
      .filter(item => item.Households > 0)
      .map(item => ({
        income: Number(item.Income_bracket),
        households: Number(item.Households),
      }))
      .sort((a, b) => a.income - b.income);

    return { householdsIncome };
  };

  return useQuery({
    queryKey: ['divorce_data', selectedState],
    queryFn: fetchDivorceData,
    enabled: !!selectedState,
  });
};
