import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check, Trash2, ArrowLeft, CheckCheck } from 'lucide-react-native';

// Sample notification data
const initialNotifications = [
  {
    id: '1',
    title: 'New Message',
    description: 'You have received a new message from John Doe',
    time: '10 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Calendar Event',
    description: 'Meeting with the design team tomorrow at 10:00 AM',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Friend Request',
    description: 'Sarah Smith sent you a friend request',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '4',
    title: 'System Update',
    description: 'Your app has been updated to the latest version',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    title: 'Payment Received',
    description: 'You received a payment of $50.00 from Michael Brown',
    time: '2 days ago',
    read: true,
  },
];

// In a real app, we would use a context or state management library
// to share this state across components
export let globalNotifications = initialNotifications;
export const updateGlobalNotifications = (newNotifications) => {
  globalNotifications = newNotifications;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  // Update global notifications when local state changes
  useEffect(() => {
    updateGlobalNotifications(notifications);
  }, [notifications]);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            setNotifications(notifications.filter((notification) => notification.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, item.read && styles.readNotification]}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <View style={styles.notificationActions}>
        {!item.read && (
          <TouchableOpacity
            style={[styles.actionButton, styles.readButton]}
            onPress={() => markAsRead(item.id)}
          >
            <Check size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteNotification(item.id)}
        >
          <Trash2 size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.readAllButton} onPress={markAllAsRead}>
            <CheckCheck size={18} color="#fff" />
            <Text style={styles.readAllButtonText}>Read All</Text>
          </TouchableOpacity>
        </View>

        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  readAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readAllButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  readNotification: {
    borderLeftColor: '#8E8E93',
    opacity: 0.8,
  },
  notificationContent: {
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  readButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});