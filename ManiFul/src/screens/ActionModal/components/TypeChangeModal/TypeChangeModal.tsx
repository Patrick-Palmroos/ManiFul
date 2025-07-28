import { useTypes } from '../../../../context/TypesContext';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles';
import text from '../../../../styles/text';
import colors from '../../../../styles/colors';

const TypeChangeModal = ({
  callback,
}: {
  callback: (typeId: number, typeName: string) => void;
}) => {
  const { categories } = useTypes();

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} style={{ maxHeight: 400 }}>
        {categories.map(category => (
          <TouchableWithoutFeedback key={category.id}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ ...text.title, fontSize: 22 }}>
                {category.name}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {category.types.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => callback(type.id, type.name)}>
                    <Text
                      style={{
                        ...text.regularLight,
                        backgroundColor: colors.gradient,
                        padding: 5,
                        borderRadius: 10,
                      }}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default TypeChangeModal;
