import { useTypes } from '../../../../context/TypesContext';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import styles from './styles';
import text from '../../../../styles/text';

const TypeChangeModal = ({
  callback,
}: {
  callback: (typeId: number, typeName: string) => void;
}) => {
  const { categories } = useTypes();

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} style={{ height: '50%' }}>
        {categories.map(category => (
          <View key={category.id}>
            <Text style={text.title}>{category.name}</Text>
            {category.types.map(type => (
              <TouchableOpacity
                key={type.id}
                onPress={() => callback(type.id, type.name)}>
                <Text style={text.regular}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TypeChangeModal;
