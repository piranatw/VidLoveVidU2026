/**
 * Image loading utilities for optimized asset management
 */

/**
 * Get scene background image path from public folder
 * @param filename - Image filename (e.g., "festival-entrance.jpg")
 * @returns Public URL path
 */
export function getSceneImage(filename: string): string {
    return `/images/scenes/${filename}`;
}

/**
 * Preload critical images to improve LCP (Largest Contentful Paint)
 * Use this for above-the-fold images that should load immediately
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
    urls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}

/**
 * Preload the next N scene backgrounds for smooth transitions
 * Call this when entering a game phase to prefetch upcoming scenes
 * @param currentIndex - Current scene index
 * @param scenes - Array of game scenes
 * @param count - Number of scenes ahead to preload (default: 2)
 */
export function preloadNextScenes(
    currentIndex: number,
    scenes: Array<{ background?: string }>,
    count: number = 2
): void {
    const urlsToPreload: string[] = [];

    for (let i = 1; i <= count; i++) {
        const nextScene = scenes[currentIndex + i];
        if (nextScene?.background) {
            urlsToPreload.push(getSceneImage(nextScene.background));
        }
    }

    if (urlsToPreload.length > 0) {
        preloadImages(urlsToPreload);
    }
}
