import { create } from 'zustand';

export const useSearchStore = create<
  { searchTerm: string } & { setSearchTerm: (searchTerm: string) => void }
>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
}));
