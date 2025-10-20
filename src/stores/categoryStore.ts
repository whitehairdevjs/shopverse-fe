'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface CategoryStore {
  selectedMainCategory: string;
  selectedSubCategory: string;
  selectedDetailCategory: string;
  setSelectedMainCategory: (id: string) => void;
  setSelectedSubCategory: (id: string) => void;
  setSelectedDetailCategory: (id: string) => void;
  clearSelection: () => void;
}

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    persist(
      (set) => ({
        selectedMainCategory: '',
        selectedSubCategory: '',
        selectedDetailCategory: '',
        setSelectedMainCategory: (id) => set({ selectedMainCategory: id }),
        setSelectedSubCategory: (id) => set({ selectedSubCategory: id }),
        setSelectedDetailCategory: (id) => set({ selectedDetailCategory: id }),
        clearSelection: () => set({ 
          selectedMainCategory: '', 
          selectedSubCategory: '', 
          selectedDetailCategory: '' 
        }),
      }),
      {
        name: 'category-storage',
      }
    ),
    { name: 'category-store', enabled: process.env.NODE_ENV === 'development' }
  )
);
