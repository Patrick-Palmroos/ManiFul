import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
  closeButton?: boolean;
  disableClosing?: boolean;
}

const Modal = ({
  children,
  onClose,
  closeButton = true,
  disableClosing = false,
}: Props) => {
  return (
    <View style={styles.backdropContainer}>
      <TouchableWithoutFeedback
        onPress={!disableClosing ? onClose : () => null}
        touchSoundDisabled={disableClosing}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalWrapper}>
        <View>
          {/* Close Button */}
          {closeButton && !disableClosing && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              {/* You can use a text fallback or an icon */}
              {/* <Text style={styles.closeText}>×</Text> */}
              <MaterialIcons
                name={'close'}
                size={30}
                color={'white'}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          )}

          {/* Modal Content */}
          <ScrollView style={styles.modalContent}>{children}</ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
