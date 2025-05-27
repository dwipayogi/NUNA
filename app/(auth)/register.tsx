import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { colors } from "@/constants/colors";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user data
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // Registration successful
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      console.error("Registration error:", err);
      Alert.alert(
        "Registration Failed",
        err.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Username</Text>
        <Input placeholder="Name" value={username} onChangeText={setUsername} />
        <Text style={styles.subtitle}>Email</Text>
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Text style={styles.subtitle}>Password</Text>{" "}
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button onPress={() => handleRegister()}>Register</Button>
        <Text style={styles.text}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexGrow: 1,
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
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});
