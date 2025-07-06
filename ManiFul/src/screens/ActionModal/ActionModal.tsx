import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image,
  Alert,
  TouchableOpacity,
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
import GradientButton from '../../components/GradientButton/GradientButton';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import styles from './styles';
import colors from '../../styles/colors';
import text from '../../styles/text';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<ImageScanType | null>(null);

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
      setLoading(true);
      const response = await parseReceipt(imageUri);
      if (!response) {
        console.log('Couldnt scan receipt');
      }
      setResData(response);
      setLoading(false);
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

  const clearData = () => {
    setImageUri(null);
    setResData(null);
  };

  const save = async () => {
    if (resData) {
      const [day, month, year] = resData.date.split('-');
      const data: transactionPost = {
        total: resData.total,
        vendor: resData.vendor,
        date: new Date(`${year}-${month}-${day}`).toISOString(),
        items: resData.items.map(i => {
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
    <View
      style={{
        alignItems: 'center',
        height: '100%',
      }}>
      <Toggle
        value={toggle}
        onValueChange={value => setToggle(value)}
        field1="Expense"
        field2="Income"
        width={'70%'}
      />

      {!toggle ? (
        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            {imageUri ? (
              <View style={styles.receiptContainer}>
                {1 === 1 && resData ? (
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>{resData.total}€</Text>
                    <Text>{resData.date}</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: imageUri }}
                    resizeMode="cover"
                    style={styles.imageStyle}
                  />
                )}
                <TouchableOpacity
                  onPress={clearData}
                  disabled={loading}
                  activeOpacity={1}
                  style={
                    loading
                      ? { ...styles.removeButton, backgroundColor: 'grey' }
                      : styles.removeButton
                  }>
                  <Text style={text.regularLight}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.receiptContainer}>
                <TouchableOpacity
                  onPress={openAndroidStyleChooser}
                  style={styles.receiptButton}>
                  <MaterialIcons
                    name={'document-scanner'}
                    size={60}
                    color={colors.gradient}
                  />
                </TouchableOpacity>
              </View>
            )}
            <GradientButton
              text={resData ? 'Receipt details' : 'Scan receipt'}
              onClick={resData ? () => null : getResults}
              loading={loading}
              disabled={imageUri ? false : true}
              width={'60%'}
              marginTop={30}
            />
          </View>
          <Button title="results" onPress={getResults} />
          <Button title="ping" onPress={pingRasperry} />
          <Button title="Save receipt" onPress={save} />
          <View
            style={{
              width: '100%',
              backgroundColor: 'blue',
              marginTop: 30,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'yellow',
                padding: 2,
                width: '80%',
              }}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
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
