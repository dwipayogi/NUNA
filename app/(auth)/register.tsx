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
      setError("Silakan isi semua kolom");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://nuna.yogserver.web.id/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Pendaftaran gagal");
      }

      // Menyimpan token dan data pengguna
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // Pendaftaran berhasil
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran");
      console.error("Kesalahan pendaftaran:", err);
      Alert.alert(
        "Pendaftaran Gagal",
        err.message || "Terjadi kesalahan saat pendaftaran"
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
        <Text style={styles.title}>Buat Akun</Text>
        <Text style={styles.subtitle}>Nama Pengguna</Text>
        <Input placeholder="Nama" value={username} onChangeText={setUsername} />
        <Text style={styles.subtitle}>Email</Text>
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Text style={styles.subtitle}>Kata Sandi</Text>{" "}
        <Input
          placeholder="Kata Sandi"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button onPress={() => handleRegister()}>Daftar</Button>
        <Text style={styles.text}>
          Sudah punya akun?{" "}
          <Link href="/login" style={styles.link}>
            Masuk
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
