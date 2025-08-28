import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import text from '../../styles/text';
import colors from '../../styles/colors';

const ProfilePage = () => {
  const { logout, user } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        height: '100%',
        padding: 10,
      }}>
      <Text style={{ ...text.title }}>Hello {user?.username}!</Text>
      <Text style={text.regular}>Email: {user?.email}</Text>
      <View style={{ alignItems: 'center' }}>
        <View style={{ marginTop: 40, width: '60%' }}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>
      <Text style={{ ...text.regular, marginTop: 20 }}>
        To delete account please contact: {'\n'}palmroos.patrick@gmail.com
      </Text>
    </View>
  );
};

export default ProfilePage;
