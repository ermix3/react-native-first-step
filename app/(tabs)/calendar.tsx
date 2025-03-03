import { View, Text, StyleSheet } from 'react-native';
import NotificationButton from '@/components/NotificationButton';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function CalendarScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <NotificationButton />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar Screen</Text>
      <Text style={styles.description}>Your schedule will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});