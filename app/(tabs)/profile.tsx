import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import NotificationButton from '@/components/NotificationButton';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <NotificationButton />,
    });
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => console.log("User logged out"),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Jane Doe</Text>
        <Text style={styles.email}>jane.doe@example.com</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>janedoe</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>San Francisco, CA</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>January 2023</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});