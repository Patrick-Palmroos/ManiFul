//LandingPage.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './styles';
import { LandingPageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
    const navigation = useNavigation<LandingPageNavigationProp>();

    return (
        <View style={styles.container}>
            <Text>Landing Page</Text>
            <Button title='go to login' onPress={() => navigation.navigate("login")}/>
        </View>
    );
};

export default LandingPage;