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

/**
 * GradientButton component renders a custom button with gradient background.
 *
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {() => void} props.onClick - Function for handling click event
 * @param {boolean} [props.loading=false] - Loading state disables button and shows loading text
 * @param {string} [props.width='100%'] - Button width value
 * @param {number} [props.marginTop] - Margin top
 * @param {number} [props.marginBottom] - Margin bottom
 * @param {number} [props.marginLeft] - Margin left
 * @param {number} [props.marginRight] - Margin right
 * @param {number} [props.margin=8] - Default margin applied if no specific margins are set
 *
 * @returns {JSX.Element} The rendered button component
 */
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
