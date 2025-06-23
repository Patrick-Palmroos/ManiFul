import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
    }
  };

  return (
    <View>
      <Text>Profile!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfilePage;
