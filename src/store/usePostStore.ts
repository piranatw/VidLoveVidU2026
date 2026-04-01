import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import * as postService from '../lib/supabase/postService';
import type { LostItem } from '../types';

interface PostState {
    items: LostItem[];
    isLoading: boolean;
    error: string | null;

    fetchItems: () => Promise<void>;
    addItem: (item: Omit<LostItem, 'id' | 'foundAt' | 'isClaimed'>, file?: File) => Promise<void>;
    updateItem: (id: string, data: Partial<Omit<LostItem, 'id' | 'foundAt'>>, newFile?: File) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    markAsClaimed: (id: string) => Promise<void>;
    toggleClaimed: (id: string) => Promise<void>;
}

// Mock data for fallback/dev
const MOCK_ITEMS: LostItem[] = [
    {
        id: '1',
        name: 'Red Scarf',
        description: 'Found near the main stage entrance.',
        location: 'Main Stage',
        foundAt: new Date().toISOString(),
        isClaimed: false,
        imageUrl: 'https://images.unsplash.com/photo-1520903920248-282e461a6a', // Placeholder
    },
    {
        id: '2',
        name: 'iPhone 13 Case',
        description: 'Clear case with stickers.',
        location: 'Food Court',
        foundAt: new Date(Date.now() - 3600000).toISOString(),
        isClaimed: false,
    },
];

export const usePostStore = create<PostState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchItems: async () => {
        set({ isLoading: true, error: null });
        try {
            if (!supabase) {
                console.warn("Supabase not configured, using mock data.");
                setTimeout(() => set({ items: MOCK_ITEMS, isLoading: false }), 500);
                return;
            }

            const { data, error } = await supabase
                .from('lost_items')
                .select('*')
                .order('found_at', { ascending: false });

            if (error) {
                console.error("Supabase fetch error:", error);
                // If error (e.g., table missing), fallback to mock for demo continuity?
                // Or just show error. Let's fallback for now to be safe during setup.
                set({ items: MOCK_ITEMS, isLoading: false, error: 'Failed to fetch live data found. Using cached/mock.' });
                return;
            }

            const mappedItems: LostItem[] = (data || []).map(d => ({
                id: d.id,
                name: d.name,
                description: d.description,
                location: d.location,
                imageUrl: d.image_url,
                foundAt: d.found_at,
                isClaimed: d.is_claimed,
                contactInfo: d.contact_info
            }));

            set({ items: mappedItems, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            set({ items: MOCK_ITEMS }); // Fallback
        }
    },

    addItem: async (itemData, file?) => {
        if (!supabase) {
            console.warn('Supabase not configured, cannot add item.');
            return;
        }

        try {
            await postService.createPost(itemData, file);
            // Refresh list
            await get().fetchItems();
        } catch (err) {
            console.error("Failed to add item:", err);
            throw err;
        }
    },

    updateItem: async (id, data, newFile?) => {
        if (!supabase) {
            console.warn('Supabase not configured, cannot update item.');
            return;
        }

        try {
            // Optimistic update
            const items = get().items;
            const index = items.findIndex(item => item.id === id);
            if (index !== -1) {
                const updatedItems = [...items];
                updatedItems[index] = { ...updatedItems[index], ...data };
                set({ items: updatedItems });
            }

            await postService.updatePost(id, data, newFile);
            // Refresh to get accurate data
            await get().fetchItems();
        } catch (err) {
            console.error("Failed to update item:", err);
            // Revert on error
            await get().fetchItems();
            throw err;
        }
    },

    deleteItem: async (id) => {
        if (!supabase) {
            console.warn('Supabase not configured, cannot delete item.');
            return;
        }

        try {
            // Optimistic delete
            set({ items: get().items.filter(item => item.id !== id) });

            await postService.deletePost(id);
        } catch (err) {
            console.error("Failed to delete item:", err);
            // Revert on error
            await get().fetchItems();
            throw err;
        }
    },

    toggleClaimed: async (id) => {
        if (!supabase) {
            console.warn('Supabase not configured, cannot toggle claimed.');
            return;
        }

        try {
            const items = get().items;
            const item = items.find(i => i.id === id);
            if (!item) return;

            const newClaimedStatus = !item.isClaimed;

            // Optimistic update
            const updatedItems = items.map(i =>
                i.id === id ? { ...i, isClaimed: newClaimedStatus } : i
            );
            set({ items: updatedItems });

            await postService.toggleClaimed(id, newClaimedStatus);
        } catch (err) {
            console.error("Failed to toggle claimed:", err);
            // Revert on error
            await get().fetchItems();
            throw err;
        }
    },

    markAsClaimed: async (id) => {
        // Deprecated: Use toggleClaimed instead
        await get().toggleClaimed(id);
    }
}));
