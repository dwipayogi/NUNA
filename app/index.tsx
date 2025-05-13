import { StyleSheet, Text, View, Image } from "react-native";

import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import { Button } from "@/components/button";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>NUNA</Text>
        <Text style={styles.subtitle}>Let Your Mind Speak</Text>
      </View>
      <View style={styles.bottomContent}>
        <Link href="/register" asChild>
          <Button>Register</Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
    padding: 16,
    justifyContent: "space-between",
  },
  topContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  bottomContent: {
    width: "100%",
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 320,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primaryBlue,
    marginTop: 8,
  },
});
