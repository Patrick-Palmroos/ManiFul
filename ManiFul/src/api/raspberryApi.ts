import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { API_KEY, API_URL } from '@env';
import { TransactionData } from '../types/data';
import { ImageScanType } from '../types/raspberry';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const getMimeType = (uri: string): string => {
  const lowerUri = uri.toLowerCase();
  if (lowerUri.endsWith('.png')) return 'image/png';
  if (lowerUri.endsWith('.jpg') || lowerUri.endsWith('.jpeg'))
    return 'image/jpeg';
  return 'application/octet-stream'; // fallback
};

const convertToPngIfNeeded = async (
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

export const parseReceipt = async (imageUri: string) => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) {
    console.log('No credentials found in Keychain');
    return false;
  }
  const { uri: processedUri, mimeType } = await convertToPngIfNeeded(imageUri);
  const formData = new FormData();

  formData.append('image', {
    uri: processedUri,
    name: 'receipt.png',
    type: mimeType,
  });
  console.log('Stored token:', creds.password);
  console.log('fetching....');
  try {
    const response = await axios.post(
      `${API_URL}/api/receipts/parse`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${creds.password}`,
          'BACKEND-API-KEY': API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('res: ', response);
    console.log('Done.');
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

export const pingRasp = async () => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) {
    console.log('No credentials found in Keychain');
    return false;
  }

  console.log('Stored token:', creds.password);
  console.log('fetching....');
  try {
    const response = await axios.get(`${API_URL}/api/test/connection`, {
      headers: {
        Authorization: `Bearer ${creds.password}`,
        'BACKEND-API-KEY': API_KEY,
      },
    });

    console.log('res: ', response);
    console.log('Done.');
    return response;
  } catch (e) {
    console.log('Error fethcing backend data: ', e);
    return null;
  }
};
