import { View, Text, Button, ScrollView } from 'react-native';
import { fetchAllBudgets } from '../../api/budgetApi';
import colors from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect } from 'react';

const BudgetsPage = () => {
  const getThemLol = async () => {
    const res = await fetchAllBudgets();
    console.log(res);
  };

  useEffect(() => {
    getThemLol();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={{ flex: 1, margin: 20 }}>
        <LinearGradient
          colors={[colors.gradient, colors.highlight]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{
            height: 120,
            width: '100%',
            borderRadius: 10,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text>Current month:</Text>
              <Text>400€</Text>
              <Text>Edit</Text>
            </View>
            <View>
              <Text>Meter</Text>
            </View>
          </View>
        </LinearGradient>
        <Text>Budgets</Text>
        <Button title="LÖl getting shits" onPress={getThemLol} />
      </View>
    </ScrollView>
  );
};

export default BudgetsPage;
