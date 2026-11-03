import { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedSplash from '../components/AnimatedSplash';
import UpdatePrompt from '../components/UpdatePrompt';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const hideNativeSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);
  const finishSplash = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          // Same push transition for every stack page (details, update,
          // notifications, help, feedback). Tab switches below use the same
          // 250ms horizontal slide so routing feels identical everywhere.
          animation: 'slide_from_right',
          animationDuration: 250,
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
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: 'Details',
          }}
        />
        <Stack.Screen
          name="update"
          options={{
            title: 'App Update',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="help"
          options={{
            title: 'Help & FAQ',
          }}
        />
        <Stack.Screen
          name="feedback"
          options={{
            title: 'Feedback',
          }}
        />
      </Stack>
      <StatusBar style="light" />
      {splashDone && <UpdatePrompt />}
      {!splashDone && (
        <AnimatedSplash onReady={hideNativeSplash} onFinished={finishSplash} />
      )}
    </SafeAreaProvider>
  );
}
