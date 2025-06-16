import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import colors from '../../styles/colors';

export default function GradientButton({
  text,
  onClick,
  width = '100%',
  loading = false,
  marginTop = undefined,
  marginBottom = undefined,
  marginLeft = undefined,
  marginRight = undefined,
  margin = 8,
}: {
  text: string;
  onClick: () => void;
  loading?: boolean;
  width?: DimensionValue;
  marginTop?: DimensionValue | undefined;
  marginBottom?: DimensionValue | undefined;
  marginLeft?: DimensionValue | undefined;
  marginRight?: DimensionValue | undefined;
  margin?: DimensionValue;
}) {
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.8}
      style={{
        ...styles.container,
        width,
        marginTop: marginTop ?? margin,
        marginBottom: marginBottom ?? margin,
        marginLeft: marginLeft ?? margin,
        marginRight: marginRight ?? margin,
      }}
      disabled={loading}>
      <LinearGradient
        colors={[colors.highlight, colors.gradient]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}>
        <View>
          {loading ? (
            <ActivityIndicator size={30} color={'white'} />
          ) : (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.buttonText}>
              {text}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
