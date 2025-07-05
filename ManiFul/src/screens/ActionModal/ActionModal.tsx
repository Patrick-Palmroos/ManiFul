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
import { saveTransaction } from '../../api/transactionApi';
import {
  TransactionData,
  transactionPost,
  TransactionPostItem,
} from '../../types/data';
import Toggle from '../../components/Toggle';

const options: CameraOptions = {
  mediaType: 'photo' as const,
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.5,
};

const ActionModal = () => {
  const { openModal, closeModal } = useModalContext();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
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

  const save = async () => {
    if (res) {
      const [day, month, year] = res.date.split('-');
      const data: transactionPost = {
        total: res.total,
        vendor: res.vendor,
        date: new Date(`${year}-${month}-${day}`).toISOString(),
        items: res.items.map(i => {
          return {
            typeId: 7,
            name: i.name,
            total: i.price,
          } as TransactionPostItem;
        }),
      };
      const response = await saveTransaction({ data: data });
      console.log('result is: ', response);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Toggle
        value={toggle}
        onValueChange={value => setToggle(value)}
        field1="Expense"
        field2="Income"
        width={'70%'}
      />
      {!toggle ? (
        <View style={{ width: '100%' }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 200,
                height: 200,
                marginTop: 20,
                borderRadius: 10,
              }}
            />
          )}
          <Button title="results" onPress={getResults} />
          <Button title="ping" onPress={pingRasperry} />
          <Button title="Selector" onPress={openAndroidStyleChooser} />
          {res && <Button title="Save receipt" onPress={save} />}
        </View>
      ) : (
        <View>
          <Text>INCOME</Text>
        </View>
      )}
    </View>
  );
};

export default ActionModal;
