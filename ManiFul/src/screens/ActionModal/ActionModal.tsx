import { View, Text, PermissionsAndroid, Button, Image } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
} from 'react-native-image-picker';
import { useState } from 'react';
import React from 'react';
import { receiptToJson } from '../../api/raspberryApi';

const options: CameraOptions = {
  mediaType: 'photo' as const,
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.8,
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

  const getResults = () => {
    if (imageUri) {
      receiptToJson({ imageUri: imageUri });
    }
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
    </View>
  );
};

export default ActionModal;
