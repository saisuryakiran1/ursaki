import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { colors } from '../theme';
import HomeScreen from '../screens/Home/HomeScreen';
import ShadowModeGate from '../screens/ShadowMode/ShadowModeGate';
import ShadowBattleScreen from '../screens/ShadowMode/ShadowBattleScreen';
import MemoryPalaceScene from '../screens/MemoryPalace/MemoryPalaceScene';
import MindModFeed from '../screens/Marketplace/MindModFeed';
import ModDetailScreen from '../screens/Marketplace/ModDetailScreen';
import CreateModScreen from '../screens/Marketplace/CreateModScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import UserSettings from '../screens/Profile/UserSettings';
import BridgeModeScreen from '../screens/SocialBridge/BridgeModeScreen';

const Tab = createBottomTabNavigator();
const ShadowStack = createNativeStackNavigator();
const PalaceStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function ShadowNavigator(): React.JSX.Element {
  return (
    <ShadowStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bg_surface }, headerTintColor: colors.text_primary }}>
      <ShadowStack.Screen name="ShadowGate" component={ShadowModeGate} options={{ title: 'Shadow Mode' }} />
      <ShadowStack.Screen name="ShadowBattle" component={ShadowBattleScreen} options={{ headerShown: false }} />
    </ShadowStack.Navigator>
  );
}

function PalaceNavigator(): React.JSX.Element {
  return (
    <PalaceStack.Navigator screenOptions={{ headerShown: false }}>
      <PalaceStack.Screen name="Palace" component={MemoryPalaceScene} />
    </PalaceStack.Navigator>
  );
}

function CommunityNavigator(): React.JSX.Element {
  return (
    <CommunityStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bg_surface }, headerTintColor: colors.text_primary }}>
      <CommunityStack.Screen name="Marketplace" component={MindModFeed} options={{ title: 'Mind-Mods' }} />
      <CommunityStack.Screen name="ModDetail" component={ModDetailScreen} options={{ title: 'Mod Detail' }} />
      <CommunityStack.Screen name="CreateMod" component={CreateModScreen} options={{ title: 'Create Mod' }} />
      <CommunityStack.Screen name="Bridge" component={BridgeModeScreen} options={{ title: 'Social Bridge' }} />
    </CommunityStack.Navigator>
  );
}

function ProfileNavigator(): React.JSX.Element {
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.bg_surface }, headerTintColor: colors.text_primary }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="Settings" component={UserSettings} options={{ title: 'Settings' }} />
    </ProfileStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }): React.JSX.Element {
  return (
    <Text style={{ color: focused ? colors.accent_primary : colors.text_muted, fontSize: 10 }}>
      {label}
    </Text>
  );
}

export default function MainTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bg_surface, borderTopColor: '#1a1a24' },
        tabBarActiveTintColor: colors.accent_primary,
        tabBarInactiveTintColor: colors.text_muted,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="ShadowTab"
        component={ShadowNavigator}
        options={{ tabBarLabel: 'Shadow', tabBarIcon: ({ focused }) => <TabIcon label="🌑" focused={focused} /> }}
      />
      <Tab.Screen
        name="PalaceTab"
        component={PalaceNavigator}
        options={{ tabBarLabel: 'Palace', tabBarIcon: ({ focused }) => <TabIcon label="🗺️" focused={focused} /> }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityNavigator}
        options={{ tabBarLabel: 'Community', tabBarIcon: ({ focused }) => <TabIcon label="🌐" focused={focused} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
