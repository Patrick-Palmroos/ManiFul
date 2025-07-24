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
import { useTypes } from '../../context/TypesContext';
import { useTransactions } from '../../context/TransactionContext';
import ReceiptContents from './components/ReceiptContents';
import { showMessage } from 'react-native-flash-message';

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
  const { types, refreshData } = useTypes();
  const { createTransaction } = useTransactions();

  // console.log('cats and types: ', types);

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
        maxNumDocuments: 1,
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

  const getResults = async () => {
    if (imageUri) {
      setLoading(true);

      openModal(<ReceiptLoading />, 'loading', {
        disableClosing: true,
      });

      //shouldnt enter here but this shit sometimes is empty
      if (types.length === 0) {
        await refreshData();
      }

      const response = await parseReceipt(imageUri, types);
      if (response.code !== 200 || !response.data) {
        showMessage({
          message: 'Error while scanning your receipt',
          description: `Error code: ${response.code} - ${response.message}`,
          duration: 5000,
          floating: true,
          type: 'danger',
        });
        setLoading(false);
        closeModal('loading');
        return;
      }
      setResData(response.data);
      setLoading(false);
      closeModal('loading');
      openModal(
        <ReceiptContents
          data={response.data}
          close={() => {
            closeModal('contents');
          }}
        />,
        'contents',
        { disableClosing: true },
      );
    }
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
            type_id: 7,
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
                {resData ? (
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ ...text.moneyDark, textAlign: 'center' }}>
                      Receipt scanned succesfully
                    </Text>
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
                  onPress={openScanner}
                  style={styles.receiptButton}>
                  <MaterialIcons
                    name={'document-scanner'}
                    size={60}
                    color={colors.gradient}
                  />
                </TouchableOpacity>
              </View>
            )}
            <Text
              style={{ ...text.subtext, marginTop: 20, textAlign: 'center' }}>
              Make sure to crop the receipt to include only the vendor, date,
              items and total for better results.
            </Text>
            <GradientButton
              text={resData ? 'Receipt details' : 'Scan receipt'}
              onClick={
                resData
                  ? () =>
                      openModal(
                        <ReceiptContents
                          data={resData}
                          close={() => {
                            closeModal('contents');
                          }}
                        />,
                        'contents',
                        { disableClosing: true },
                      )
                  : getResults
              }
              disabled={resData ? false : imageUri ? false : true}
              width={'60%'}
              marginTop={10}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            {/*
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
            </TouchableOpacity> */}
          </View>
        </View>
      ) : (
        <View>
          <Text style={{ ...text.title, marginTop: 20 }}>Coming soon...</Text>
        </View>
      )}
    </View>
  );
};

export default ActionModal;
