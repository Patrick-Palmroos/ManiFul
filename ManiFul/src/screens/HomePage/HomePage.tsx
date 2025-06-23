import { Text, View, Button, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { HomePageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { UserCredentials } from 'react-native-keychain';
import colors from '../../styles/colors';
import styles from '../HomePage/styles';
import text from '../../styles/text';
import PieChart from '../../components/PieChart/PieChart';

const data = {
  test1: [
    { value: 4, title: 'groceries' },
    { value: 2, title: 'Bills' },
    { value: 2, title: 'Snacks' }
  ],
  test2: [
    { value: 4, title: 'groceries' },
    { value: 2, title: 'Bills' },
    { value: 2, title: 'Snacks' }
  ],
  test3: [
    { value: 4, title: 'groceries' },
    { value: 2, title: 'Bills' },
    { value: 2, title: 'Snacks' }
  ]
};

const HomePage = () => {
  return (
    <View style={styles.container}>
      {/* Displays the money left for the month */}
      <LinearGradient
        colors={[colors.highlight, colors.gradient]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.topView}>
        <Text style={{ ...text.regularLight, lineHeight: 20 }}>
          Left for the month:
        </Text>
        <Text style={{ ...text.moneyLight, fontSize: 36, lineHeight: 50 }}>
          600,37€
        </Text>
        <Text style={{ ...text.regularLight, fontSize: 14, lineHeight: 20 }}>
          <Text style={{ ...text.moneyLight, fontSize: 14, lineHeight: 20 }}>
            47%
          </Text>{' '}
          of the monthly budget spent.
        </Text>
      </LinearGradient>
      {/* View for the data */}
      <View style={styles.contentView}>
        <Text style={{ color: 'black' }}>DATA DATA DATA!</Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 280,
            width: '100%',
            justifyContent: 'center',
          }}>
          <PieChart
            pie_rad={100}
            data={data.map((x) => {x.value})
              
              [
              { value: 1, color: '#BFFF71' },
              { value: 1, color: '#FF9898' },
              { value: 1, color: '#85C2FF' },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default HomePage;
