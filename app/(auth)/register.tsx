import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { colors } from "@/constants/colors";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    setLoading(false);
    router.push("/login");
  }

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Username</Text>
      <Input placeholder="Name" value={username} onChangeText={setUsername} />
      <Text style={styles.subtitle}>Email</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Text style={styles.subtitle}>Password</Text>
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => handleRegister()}>Register</Button>
      <Text style={styles.text}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundBlue,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
    justifyContent: "flex-end",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  text: {
    fontSize: 16,
    color: colors.primaryBlue,
    textAlign: "center",
  },
  link: {
    color: colors.primaryBlue,
    fontWeight: "bold",
  },
});
