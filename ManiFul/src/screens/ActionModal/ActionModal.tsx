import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image,
  Alert,
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
import { useModalContext } from '../../context/ModalContext';
import OptionPicker from './components/OptionPicker';
import { ImageScanType } from '../../types/raspberry';

const options: CameraOptions = {
  mediaType: 'photo' as const,
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.5,
};

const ActionModal = () => {
  const { openModal, closeModal } = useModalContext();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [res, setRes] = useState<ImageScanType | null>(null);

  const handleResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('cancelled');
    } else if (response.errorCode) {
      console.warn('Error ', response.errorMessage || 'Unknown error');
    } else if (response.assets && response.assets.length > 0) {
      setImageUri(response.assets[0].uri || null);
      closeModal('optionPicker');
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
      setRes(res);
    }
  };

  const pingRasperry = async () => {
    const resp = await pingRasp();
    console.log(resp);
  };

  const openAndroidStyleChooser = () => {
    openModal(
      <OptionPicker camera={openCamera} gallery={openGallery} />,
      'optionPicker',
    );
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
      <Button title="results" onPress={getResults} />
      <Button title="ping" onPress={pingRasperry} />
      <Button title="Selector" onPress={openAndroidStyleChooser} />
      {res && <Button title="Save receipt" onPress={() => null} />}
    </View>
  );
};

export default ActionModal;
