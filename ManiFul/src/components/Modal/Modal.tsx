import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import styles from './styles';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: Props) => {
  return (
    <View style={styles.backdropContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalWrapper}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            {/* You can use a text fallback or an icon */}
            {/* <Text style={styles.closeText}>×</Text> */}
            <Text>Close</Text>
          </TouchableOpacity>

          {/* Modal Content */}
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Modal;
