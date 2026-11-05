import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer } from 'expo-router/drawer';
import HeaderMenuButton from '../../components/HeaderMenuButton';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerLeft: () => <HeaderMenuButton />,
        drawerActiveTintColor: '#6200ee',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
        },
        drawerStyle: {
          width: 280,
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
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerLabel: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: 'About',
          drawerLabel: 'About',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
      {/* Stack-style pages: reachable by navigation, hidden from the menu,
          but still inside the drawer navigator so the header menu button
          works on every screen. */}
      <Drawer.Screen
        name="details"
        options={{
          title: 'Details',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="update"
        options={{
          title: 'App Update',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          title: 'Help & FAQ',
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          title: 'Feedback',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
