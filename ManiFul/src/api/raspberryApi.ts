import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { API_KEY, API_URL } from '@env';
import { TransactionData } from '../types/data';
import { ImageScanType } from '../types/raspberry';
import { convertToPngIfNeeded } from '../utils/imageProcessing';
import { Type } from '../types/categories';

export const parseReceipt = async (
  imageUri: string,
  types: Array<Type>,
): Promise<ImageScanType | null> => {
  const creds = await Keychain.getGenericPassword();
  if (!creds) {
    console.log('No credentials found in Keychain');
    return null;
  }
  const { uri: processedUri, mimeType } = await convertToPngIfNeeded(imageUri);
  const formData = new FormData();

  formData.append('image', {
    uri: processedUri,
    name: 'receipt.png',
    type: mimeType,
  } as any);
  formData.append('types', JSON.stringify(types));

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

    console.log('res: ', response.data.data);
    return response.data.data as ImageScanType;
  } catch (error) {
    console.error(error);
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
