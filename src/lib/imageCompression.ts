import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, options?: { maxSizeMB?: number; maxWidthOrHeight?: number }): Promise<File> {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, { ...defaultOptions, ...options });
    // Keep original filename but return compressed file
    return new File([compressedFile], file.name, { type: compressedFile.type });
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // fallback to original if compression fails
  }
}
