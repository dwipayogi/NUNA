import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import { Button } from "@/components/button";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NUNA</Text>
      <Text style={styles.subtitle}>Let's Your Mind Speak</Text>
      <Link href="/register" asChild>
        <Button>Register</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primaryBlue,
  },
});
