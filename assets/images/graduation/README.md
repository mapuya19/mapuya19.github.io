# Graduation Photos

This directory contains photos for the graduation portfolio gallery.

## File Naming Convention

Photos should be named following this pattern:

```
photo_01.webp  (full-size image)
photo_01.jpg   (JPEG fallback)
thumb_01.webp  (thumbnail, 250x250px)
thumb_01.jpg   (thumbnail JPEG fallback)

photo_02.webp
photo_02.jpg
thumb_02.webp
thumb_02.jpg

...and so on
```

## Image Specifications

- **Full-size images**: 1200-1500px max dimension
- **Thumbnails**: 250x250px (square or cropped)
- **Format**: WebP primary, JPEG fallback
- **Compression**: Optimize for web (quality ~80-90)

## How to Add Photos

1. Place your full-size photos in this directory as `photo_XX.webp`
2. Create JPEG fallbacks as `photo_XX.jpg`
3. Create thumbnails as `thumb_XX.webp` and `thumb_XX.jpg`
4. Update the image list in `assets/js/graduation.js` if needed

The gallery will automatically display up to 12 photos. You can add more by updating the `imageList` array in the JavaScript file.

## Current Images

When you add your photos, they will replace the placeholder entries. The gallery will display:
- A grid of thumbnails on the main page
- Full-size images in a modal when clicked
- Navigation (previous/next) between photos
- Keyboard support (arrows, ESC)
- Touch/swipe support on mobile

## Wallpaper

The `bliss.jpg` file provides the classic Windows XP-style grassy hill background for the gallery.
