import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when component is mounted
 * Useful for fullscreen experiences like games or modals
 */
export function useLockBodyScroll() {
    useEffect(() => {
        // Save original overflow value
        const originalOverflow = document.body.style.overflow;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Cleanup: restore original overflow when component unmounts
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);
}
