import { TouchableOpacity, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function NotificationButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/notifications');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Bell size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 10,
  },
});