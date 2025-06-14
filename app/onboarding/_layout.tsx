import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="features" />
      <Stack.Screen name="user-type" />
      <Stack.Screen name="tourist-details" />
      <Stack.Screen name="local-details" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="location-permission" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}