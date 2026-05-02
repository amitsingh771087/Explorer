import { create } from "zustand";

interface UserStore {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  resetAdmin: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
  resetAdmin: () => set({ isAdmin: false }),
}));
