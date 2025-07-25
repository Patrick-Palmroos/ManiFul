import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import { Platform, Image } from 'react-native';

const MAX_DIMENSION = 1000;

export const getMimeType = (uri: string): string => {
  const lowerUri = uri.toLowerCase();
  if (lowerUri.endsWith('.png')) return 'image/png';
  if (lowerUri.endsWith('.jpg') || lowerUri.endsWith('.jpeg'))
    return 'image/jpeg';
  return 'application/octet-stream'; // fallback
};

export const getImageSize = (
  uri: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      error => reject(error),
    );
  });
};

export const convertToPngIfNeeded = async (
  uri: string,
): Promise<{ uri: string; mimeType: string }> => {
  try {
    const mime = getMimeType(uri);

    if (mime === 'image/png') {
      return { uri, mimeType: 'image/png' };
    }

    const { width, height } = await getImageSize(uri);
    if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
      const result = await ImageResizer.createResizedImage(
        uri,
        width,
        height,
        'PNG',
        100, // Max quality
        0,
        undefined,
      );
      return { uri: result.uri, mimeType: 'image/png' };
    }

    // Resize only if necessary, but use higher quality
    const result = await ImageResizer.createResizedImage(
      uri,
      MAX_DIMENSION,
      MAX_DIMENSION,
      'PNG',
      95, // Slightly lower than 100 to reduce file size
      0,
      undefined,
    );

    return { uri: result.uri, mimeType: 'image/png' };
  } catch (error) {
    console.error('Image conversion error:', error);
    throw new Error('Failed to process image');
  }
};

export const getProcessedImageUri = async (uri: string): Promise<string> => {
  //handle content
  if (uri.startsWith('content://')) {
    const destPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.png`;
    await RNFS.copyFile(uri, destPath);
    return `file://${destPath}`;
  }

  // Android specific
  if (Platform.OS === 'android') {
    // Normalize file URI (file://path -> file:///path)
    const normalizedUri = uri.startsWith('file://') ? uri : `file://${uri}`;
    const filePath = normalizedUri.replace('file://', '');

    // Verify file exists
    if (!(await RNFS.exists(filePath))) {
      throw new Error('File not found at path: ' + filePath);
    }

    return normalizedUri;
  }

  // IOS etc here.
  return uri;
};
