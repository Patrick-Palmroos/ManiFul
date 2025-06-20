import { View, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import styles from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types/navigation';

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
      <TouchableOpacity onPress={() => null} style={styles.iconContainer}>
        <MaterialIcons name="account-circle" size={45} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
