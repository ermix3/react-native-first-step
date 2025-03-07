import { Stack } from 'expo-router';
import NotificationButton from '@/components/NotificationButton';

export default function PostsLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <NotificationButton />,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Posts',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Post Details',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Post',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Post',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}