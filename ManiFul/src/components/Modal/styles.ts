import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import text from '../../styles/text';

export default StyleSheet.create({
  backdropContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWrapper: {
    width: '94%',
    maxHeight: '90%',
    backgroundColor: colors.background,
    borderRadius: 11,
    padding: 10,
    elevation: 10,
  },
  modalContent: {
    marginTop: 30,
    padding: 10,
  },
  closeButton: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    width: 40,
  },
  closeIcon: {
    backgroundColor: '#ff5c5c',
    borderRadius: 35,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
