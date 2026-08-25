import { create } from 'zustand';

export type ShoppingListViewMode = 'ingredients' | 'recipes';

type ShoppingListViewModeState = {
  viewMode: ShoppingListViewMode;
};

type ShoppingListViewModeActions = {
  setViewMode: (viewMode: ShoppingListViewMode) => void;
};

const initialState: ShoppingListViewModeState = {
  viewMode: 'ingredients',
};

export const useShoppingListViewModeStore = create<
  ShoppingListViewModeState & ShoppingListViewModeActions
>((set) => ({
  ...initialState,
  setViewMode: (viewMode) => set({ viewMode }),
}));
