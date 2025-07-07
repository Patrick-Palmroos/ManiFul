import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
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
import OptionPicker from './components/OptionPicker/OptionPicker';
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
import ReceiptLoading from './components/ReceiptLoading';
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImagePicker from 'react-native-image-crop-picker';

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
  const [saving, setSaving] = useState<boolean>(false);
  const [resData, setResData] = useState<ImageScanType | null>(null);

  const handleResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('cancelled');
    } else if (response.errorCode) {
      console.warn('Error ', response.errorMessage || 'Unknown error');
    } else if (response.assets && response.assets.length > 0) {
      setImageUri(response.assets[0].uri || null);
      //closeModal('optionPicker');
    }
  };

  const openScanner = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        croppedImageQuality: 90,
      });

      if (scannedImages && scannedImages.length > 0) {
        const image = scannedImages[0]; // It's a file:// URI
        setImageUri(image);
        closeModal('optionPicker');
      }
    } catch (err) {
      console.error('Document scan failed:', err);
    }
  };

  const openGalleryAndCrop = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true, // enable cropping UI
        freeStyleCropEnabled: true,
        compressImageQuality: 0.8, // adjust compression if needed
        mediaType: 'photo',
      });
      setImageUri(image.path);
      closeModal('optionPicker');
    } catch (err) {
      console.error('Gallery pick/crop failed:', err);
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

      openModal(<ReceiptLoading />, 'loading', {
        disableClosing: true,
      });

      const response = await parseReceipt(imageUri);
      if (!response) {
        console.log('Couldnt scan receipt');
      }
      setResData(response);
      setLoading(false);
      closeModal('loading');
    }
  };

  const pingRasperry = async () => {
    const resp = await pingRasp();
    console.log(resp);
  };

  const openAndroidStyleChooser = () => {
    openModal(
      <OptionPicker camera={openScanner} gallery={openGalleryAndCrop} />,
      'optionPicker',
    );
  };

  const clearData = () => {
    setImageUri(null);
    setResData(null);
  };

  const save = async () => {
    if (resData) {
      setSaving(true);
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
      setSaving(false);
      setResData(null);
      setImageUri(null);
    }
  };

  return (
    <View
      style={{
        alignItems: 'center',
        height: 400,
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
            height: '90%',
            justifyContent: 'space-between',
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
              disabled={imageUri ? false : true}
              width={'60%'}
              marginTop={30}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <TouchableOpacity
              disabled={resData ? false : true}
              onPress={save}
              style={
                resData
                  ? styles.generalButton
                  : { ...styles.generalButton, backgroundColor: '#626262' }
              }>
              {saving ? (
                <ActivityIndicator size={30} color={'white'} />
              ) : (
                <Text style={{ ...text.regularLight, fontSize: 20 }}>Save</Text>
              )}
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
