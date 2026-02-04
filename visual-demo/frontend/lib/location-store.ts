import { create } from 'zustand';
import { locations, Location } from './locations';

interface LocationState {
  currentLocation: Location;
  setLocation: (locationId: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: locations[0], // Default to first location
  setLocation: (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      set({ currentLocation: location });
    }
  },
}));
