import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export const getMimeType = (uri: string): string => {
  const lowerUri = uri.toLowerCase();
  if (lowerUri.endsWith('.png')) return 'image/png';
  if (lowerUri.endsWith('.jpg') || lowerUri.endsWith('.jpeg'))
    return 'image/jpeg';
  return 'application/octet-stream'; // fallback
};

export const convertToPngIfNeeded = async (
  uri: string,
): Promise<{ uri: string; mimeType: string }> => {
  try {
    const mime = getMimeType(uri);

    if (mime === 'image/png') {
      return { uri, mimeType: 'image/png' };
    }

    const result = await ImageResizer.createResizedImage(
      uri,
      1000, // width
      1000, // height
      'PNG', // convert to PNG
      90, // quality
      0, // rotation
      undefined, // outputPath
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
