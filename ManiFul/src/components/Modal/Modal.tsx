import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
  closeButton?: boolean;
  title?: string;
  disableClosing?: boolean;
}

const Modal = ({
  children,
  onClose,
  closeButton = true,
  title = '',
  disableClosing = false,
}: Props) => {
  return (
    <View style={styles.backdropContainer}>
      <TouchableWithoutFeedback
        touchSoundDisabled={disableClosing}
        onPress={() => {
          Keyboard.dismiss();
          if (!disableClosing) {
            onClose();
          }
        }}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalWrapper}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          touchSoundDisabled={true}>
          <View>
            {/* Close Button */}
            {closeButton && !disableClosing && (
              <View style={styles.headerWrapper}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <MaterialIcons
                    name={'close'}
                    size={35}
                    color={'white'}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Modal Content */}
            <View style={styles.modalContent}>{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
