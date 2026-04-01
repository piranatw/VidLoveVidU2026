# Asset Organization & Performance Guide

This project uses an optimized asset structure for Vercel deployments.

## Directory Structure

```
/public/images/scenes/     # Scene backgrounds (edge-cached, public URLs)
/src/assets/icons/          # UI icons (bundled, cache-busted)
/src/assets/sprites/        # Character sprites (bundled)
/src/assets/backgrounds/    # Component backgrounds (bundled)
```

## Usage Patterns

### 1. Scene Backgrounds (Public Folder)

Large static images referenced in `scenes.ts`:

```typescript
import { getSceneImage } from '@/utils/imageLoader';

const scene = {
  background: 'festival-entrance.jpg'
};

// In component
const bgUrl = getSceneImage(scene.background);
// Returns: "/images/scenes/festival-entrance.jpg"
```

**Benefits:**
- Served from CDN edge
- Long-term cache (1 year)
- No bundle bloat

### 2. Component Assets (Src/Assets)

Icons and UI elements imported directly:

```typescript
import logo from '@assets/icons/logo.svg';

<img src={logo} alt="Logo" />
```

**Benefits:**
- Automatic content hashing
- Cache invalidation on updates
- Tree-shaking optimization

## Image Optimization Checklist

- [ ] Convert backgrounds to WebP (80% quality, max 1920x1080)
- [ ] Use SVG for icons (<10KB each)
- [ ] Preload critical images with `preloadImages()`
- [ ] Use `preloadNextScenes()` for smooth transitions

## Performance Targets

- **LCP (Largest Contentful Paint)**: <1.5s
- **Cache Hit Rate**: 95%+ for returning users
- **Bundle Size**: Icons <50KB total, backgrounds edge-cached
