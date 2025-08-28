import {
  View,
  Text,
  PermissionsAndroid,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CameraOptions } from 'react-native-image-picker';
import { useState } from 'react';
import React from 'react';
import { parseReceipt, pingRasp } from '../../api/raspberryApi';
import { useModalContext } from '../../context/ModalContext';
import { ImageScanType } from '../../types/raspberry';
import Toggle from '../../components/Toggle';
import GradientButton from '../../components/GradientButton/GradientButton';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import styles from './styles';
import colors from '../../styles/colors';
import text from '../../styles/text';
import ReceiptLoading from './components/ReceiptLoading';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useTypes } from '../../context/TypesContext';
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

  const requestGalleryPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 33) {
        // Android 13+ only need READ_MEDIA_IMAGES for gallery
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below need READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Gallery permission request error', err);
      return false;
    }
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission request error', err);
      return false;
    }
  };

  const openScanner = async () => {
    const hasCameraPermission = await requestCameraPermissions();
    const hasStoragePermission = await requestGalleryPermissions();
    if (!hasCameraPermission || !hasStoragePermission) {
      Alert.alert(
        'Permissions needed',
        'Please allow camera and storage permissions to scan receipts.',
      );
      return;
    }

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

  const getResults = async () => {
    if (imageUri) {
      setLoading(true);

      openModal({
        content: <ReceiptLoading />,
        id: 'loading',
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
      openModal({
        content: (
          <ReceiptContents
            data={response.data}
            close={() => {
              closeModal('contents');
            }}
          />
        ),
        id: 'contents',
        disableClosing: true,
      });
    }
  };

  const clearData = () => {
    setImageUri(null);
    setResData(null);
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
                      openModal({
                        content: (
                          <ReceiptContents
                            data={resData}
                            close={() => {
                              closeModal('contents');
                            }}
                          />
                        ),
                        id: 'contents',
                        disableClosing: true,
                      })
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
            }}></View>
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
