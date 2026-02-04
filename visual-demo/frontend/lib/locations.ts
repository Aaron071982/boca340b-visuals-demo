export interface Location {
  id: string;
  name: string;
  code: string;
}

export const locations: Location[] = [
  { 
    id: 'location-1', 
    name: 'The 6:52 Project Foundation Inc (866 East Tremont Ave)',
    code: '652-TREMONT'
  },
  { 
    id: 'location-2', 
    name: 'Community Health Center (1234 Main Street)',
    code: 'CHC-MAIN'
  },
  { 
    id: 'location-3', 
    name: 'Metro Medical Associates (5678 Broadway)',
    code: 'MMA-BROADWAY'
  },
  { 
    id: 'location-4', 
    name: 'Southside Pharmacy Network (9012 Oak Avenue)',
    code: 'SPN-OAK'
  },
  { 
    id: 'location-5', 
    name: 'Northwest Healthcare Services (3456 Pine Road)',
    code: 'NHS-PINE'
  },
];

export function getLocationById(id: string): Location | undefined {
  return locations.find(loc => loc.id === id);
}
