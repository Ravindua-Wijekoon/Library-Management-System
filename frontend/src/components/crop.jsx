export const getCroppedImg = (imageSrc, crop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    // Ensure cross-origin handling for external images
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Validate crop dimensions
      if (!crop.width || !crop.height) {
        reject(new Error('Invalid crop dimensions'));
        return;
      }

      // Set canvas size to the crop dimensions
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Draw the cropped area onto the canvas
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpeg';
        resolve(blob);
      }, 'image/jpeg');
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};
