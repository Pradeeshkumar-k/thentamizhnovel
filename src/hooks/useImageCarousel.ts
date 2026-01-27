import { useState, useEffect } from 'react';

/**
 * Custom hook for managing image carousel rotation
 * @param {Array} images - Array of images to cycle through
 * @param {number} interval - Time in milliseconds between rotations
 * @returns {number} Current active image index
 */
export const useImageCarousel = (images: any[], interval: number = 5000) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(rotationInterval);
  }, [images.length, interval]);

  return activeImageIndex;
};
