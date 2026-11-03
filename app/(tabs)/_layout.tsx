import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderBackButton from '../../components/HeaderBackButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Fully dynamic where the OS is honest: the bar sits exactly above the
  // system inset. But some firmware (seen on Xiaomi Note 11 in 3-button
  // mode) reports a far-too-small bottom inset while the buttons still
  // overlay the screen — verified against an emulator where the same code
  // measures a correct 48dp gap. A real 3-button bar needs ~48dp and an
  // honest gesture inset never reaches 40dp, so anything under 40dp cannot
  // be trusted: fall back to real button clearance instead of letting the
  // tabs slide under the buttons.
  const rawBottom = insets.bottom;
  const bottomClearance = rawBottom < 40 ? 48 : rawBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: () => <HeaderBackButton />,
        // Full-width horizontal slide on tab switches — same 250ms timing
        // as the stack push above, so every route transition feels the same
        // while the bottom tab bar stays mounted.
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                }),
              },
            ],
          },
        }),
        transitionSpec: {
          animation: 'timing',
          config: { duration: 250 },
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: bottomClearance,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerLeft: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
