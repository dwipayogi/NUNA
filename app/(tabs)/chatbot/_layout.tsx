import { Stack } from "expo-router";
import "react-native-reanimated";

export default function ChatbotLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
