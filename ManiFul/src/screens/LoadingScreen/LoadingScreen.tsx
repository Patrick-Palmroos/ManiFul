import { ActivityIndicator, View, Image, Text } from 'react-native';
import colors from '../../styles/colors';
import text from '../../styles/text';
import styles from './styles';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/maniful-logo.png')}
        style={styles.image}
      />
      <ActivityIndicator size={50} color={colors.highlight} />
      <Text style={{ ...text.subtext, marginTop: 10 }}>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
