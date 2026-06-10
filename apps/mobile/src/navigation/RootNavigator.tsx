import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '../theme/ThemeProvider';
import { colors } from '../theme';
import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import ConsentScreen from '../screens/Auth/ConsentScreen';

export type AuthStackParamList = {
  Onboarding: undefined;
  Consent: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg_primary,
    card: colors.bg_surface,
    text: colors.text_primary,
    border: colors.bg_surface,
    primary: colors.accent_primary,
  },
};

export default function RootNavigator(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Consent" component={ConsentScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
