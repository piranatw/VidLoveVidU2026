import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
    user: User | null;
    registerUser: (user: User) => void;
    clearUser: () => void;
    // Update user specific fields if needed
    updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, _get) => ({
            user: null,
            registerUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: 'vlvu69-user-storage',
        }
    )
);

export const useRegistrationCheck = () => {
    const user = useUserStore(state => state.user);
    return !!user;
};
