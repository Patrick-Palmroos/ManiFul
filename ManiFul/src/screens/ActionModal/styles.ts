import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  receiptContainer: {
    height: 180,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  receiptButton: {
    backgroundColor: colors.light,
    padding: 13,
    borderRadius: 12,
    elevation: 10,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    backgroundColor: '#ba2727',
    width: '60%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 1,
    borderRadius: 10,
    bottom: '5%',
  },
  generalButton: {
    backgroundColor: '#C61A79',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: '90%',
  },
});

export default styles;
