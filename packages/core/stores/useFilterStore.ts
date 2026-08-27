import { create } from "zustand";
import type { MediaType } from "../types/global";
import {  defaultFilters, type FilterParams } from "../utils/filterFiles";

interface FilterState {
  category: MediaType;

  filterParams: FilterParams;
  searchQuery: string;
  applyFilters: (filters: FilterParams) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: "book",

  filterParams: defaultFilters,

  searchQuery: "",

  applyFilters: (filters) => set({ filterParams: filters }),
  resetFilters: () => set({ filterParams: defaultFilters }),
  setSearchQuery: (query: string) => set({searchQuery: query}),
}));
