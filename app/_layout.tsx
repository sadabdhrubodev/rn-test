import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import UpdatePrompt from '../components/UpdatePrompt';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: 'Details',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
      <UpdatePrompt />
    </>
  );
}
