import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InterestsStore {
  savedInterests: string[]; // Array of destination IDs
  addInterest: (id: string) => void;
  removeInterest: (id: string) => void;
  toggleInterest: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
}

export const useInterestsStore = create<InterestsStore>()(
  persist(
    (set, get) => ({
      savedInterests: [],
      
      addInterest: (id: string) => {
        set((state) => ({
          savedInterests: [...state.savedInterests, id]
        }));
      },
      
      removeInterest: (id: string) => {
        set((state) => ({
          savedInterests: state.savedInterests.filter(savedId => savedId !== id)
        }));
      },
      
      toggleInterest: (id: string) => {
        const { savedInterests } = get();
        if (savedInterests.includes(id)) {
          get().removeInterest(id);
        } else {
          get().addInterest(id);
        }
      },
      
      isSaved: (id: string) => {
        return get().savedInterests.includes(id);
      },
      
      clearAll: () => {
        set({ savedInterests: [] });
      }
    }),
    {
      name: 'oman-saved-interests', // localStorage key
    }
  )
);