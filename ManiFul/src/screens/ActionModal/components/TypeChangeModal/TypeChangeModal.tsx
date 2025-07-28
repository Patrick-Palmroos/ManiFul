import { useTypes } from '../../../../context/TypesContext';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';

const TypeChangeModal = ({
  callback,
}: {
  callback: (typeId: number, typeName: string) => void;
}) => {
  const { categories } = useTypes();

  return (
    <ScrollView>
      {categories.map(category => (
        <View key={category.id}>
          <Text>{category.name}</Text>
          {category.types.map(type => (
            <TouchableOpacity
              key={type.id}
              onPress={() => callback(type.id, type.name)}>
              <Text>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default TypeChangeModal;
