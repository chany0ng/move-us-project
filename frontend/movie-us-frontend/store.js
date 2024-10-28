import { create } from "zustand";

export const userStore = create((set) => ({
  user: {
    user_name: null,
    user_email: null,
    kakao_email: null,
    user_phone: null,
  },
  setUser: (newUser) =>
    set((state) => ({
      user: {
        ...state.user,
        ...newUser,
      },
    })),
  clearUser: () =>
    set(() => ({
      user: {
        user_name: null,
        user_email: null,
        kakao_email: null,
        user_phone: null,
      },
    })),
}));
