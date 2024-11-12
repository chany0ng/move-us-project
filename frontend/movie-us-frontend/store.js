import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userStore = create(
  persist(
    (set) => ({
      user: {
        user_name: null,
        user_email: null,
        kakao_email: null,
        user_phone: null,
        user_num: null,
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
            user_num: null,
          },
        })),
    }),
    {
      name: "user-storage", // localStorage에 저장될 키 값
      getStorage: () => localStorage, // 기본값은 localStorage
    }
  )
);
