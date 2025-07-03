import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
} from 'react-native-image-picker';
import { useState } from 'react';
import React from 'react';
import { parseReceipt, pingRasp } from '../../api/raspberryApi';
import RNFS from 'react-native-fs';

const options: CameraOptions = {
  mediaType: 'photo' as const,
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.5,
};

const getProcessedUri = async (uri: string): Promise<string> => {
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

const ActionModal = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('cancelled');
    } else if (response.errorCode) {
      console.warn('Error ', response.errorMessage || 'Unknown error');
    } else if (response.assets && response.assets.length > 0) {
      setImageUri(response.assets[0].uri || null);
    }
  };

  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      launchCamera(options, handleResponse);
    }
  };

  const openGallery = () => {
    launchImageLibrary(options, handleResponse);
  };

  const getResults = async () => {
    if (imageUri) {
      const res = await parseReceipt(imageUri);
      console.log(res);
    }
  };

  const pingRasperry = async () => {
    const res = await pingRasp();
    console.log(res);
  };

  return (
    <View>
      <Text>ActionModal</Text>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}
      <Button title="camera" onPress={openCamera} />
      <Button title="gallery" onPress={openGallery} />
      <Button title="results" onPress={getResults} />
      <Button title="ping" onPress={pingRasperry} />
    </View>
  );
};

export default ActionModal;
