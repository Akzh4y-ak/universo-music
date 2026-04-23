/**
 * Extracts a dominant vibrant color from an image URL using a hidden canvas.
 * This is a lightweight alternative to heavy libraries like ColorThief.
 */
export async function getDominantColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1;
      canvas.height = 1;

      // Draw image to 1x1 canvas to average colors
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      // Ensure it's not too dark or too bright for better UI consistency
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // If color is too dark, lighten it slightly for vibrant effect
      if (brightness < 40) {
        resolve(`rgb(${r + 40}, ${g + 40}, ${b + 40})`);
      } else {
        resolve(`rgb(${r}, ${g}, ${b})`);
      }
    };

    img.onerror = () => {
      // Fallback to brand color
      resolve('rgb(30, 215, 96)');
    };
  });
}

/**
 * Returns a semi-transparent version of an RGB string.
 */
export function getAlphaColor(rgbString, alpha = 0.5) {
  return rgbString.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
}
