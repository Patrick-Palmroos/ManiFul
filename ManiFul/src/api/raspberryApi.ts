import * as Keychain from 'react-native-keychain';
import axios from 'axios';

import { RASPBERRY_API_KEY, RASPBERRY_API_URL } from '@env';
import { TransactionData } from '../types/data';

export const receiptToJson = async ({
  imageUri,
}: {
  imageUri: String;
}): Promise<TransactionData[] | null> => {
  if (RASPBERRY_API_KEY && RASPBERRY_API_URL && imageUri) {
    const file = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    };
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('image uri of: ', imageUri);
      console.log('Getting results...');
      const response = await axios.post(
        `${RASPBERRY_API_URL}/parse-receipt`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${RASPBERRY_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const raw = response.data.parsed_data;
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleaned);

      console.log('parsed data: ', parsedData);

      return response.data as TransactionData[];
    } catch (error) {
      console.log('Data fetch error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token might be expired, force logout
      }
      return null;
    }
  } else {
    return null;
  }
};
