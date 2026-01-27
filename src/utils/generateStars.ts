/**
 * Generates random star positions and properties for animation
 * @param {number} count - Number of stars to generate
 * @returns {Array} Array of star objects with position and animation properties
 */
export const generateStars = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2
  }));
};
