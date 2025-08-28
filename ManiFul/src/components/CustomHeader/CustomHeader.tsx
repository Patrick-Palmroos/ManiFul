import { View, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import styles from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';
import colors from '../../styles/colors';

type CustomHeaderProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'TabNav'>;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/maniful-logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('profile')}
        style={styles.iconContainer}>
        <MaterialIcons
          name="account-circle"
          size={50}
          color={colors.gradient}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
