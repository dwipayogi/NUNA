import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
  );
}
