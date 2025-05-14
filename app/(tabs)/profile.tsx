import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/constants/colors";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSync, setDataSync] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      setUser({
        name: data.user.username || "User",
        email: data.user.email || "user@example.com",
        username: data.user.username || "User",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Settings sections
  const accountSettings = [
    {
      icon: "user",
      label: "Edit Profil",
      action: () => console.log("Edit Profile"),
    },
    {
      icon: "lock",
      label: "Ubah Kata Sandi",
      action: () => console.log("Change Password"),
    },
    {
      icon: "bell",
      label: "Notifikasi",
      action: null,
      toggle: true,
      state: notifications,
      setState: setNotifications,
    },
    {
      icon: "moon",
      label: "Mode Gelap",
      action: null,
      toggle: true,
      state: darkMode,
      setState: setDarkMode,
    },
    {
      icon: "refresh-cw",
      label: "Sinkronisasi Data",
      action: null,
      toggle: true,
      state: dataSync,
      setState: setDataSync,
    },
  ];

  const supportSettings = [
    {
      icon: "help-circle",
      label: "Bantuan & Dukungan",
      action: () => console.log("Help & Support"),
    },
    {
      icon: "info",
      label: "Tentang Aplikasi",
      action: () => console.log("About"),
    },
    {
      icon: "file-text",
      label: "Syarat & Ketentuan",
      action: () => console.log("Terms & Conditions"),
    },
    {
      icon: "shield",
      label: "Kebijakan Privasi",
      action: () => console.log("Privacy Policy"),
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.label}
      style={styles.settingItem}
      onPress={item.action}
      disabled={item.toggle}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Feather name={item.icon} size={18} color={colors.primaryBlue} />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>

      {item.toggle ? (
        <Switch
          value={item.state}
          onValueChange={(value) => item.setState(value)}
          trackColor={{ false: "#E2E8F0", true: `${colors.primaryBlue}80` }}
          thumbColor={item.state ? colors.primaryBlue : "#FFFFFF"}
        />
      ) : (
        <Feather name="chevron-right" size={20} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}{" "}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>{" "}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUserProfile} />
        }
      >
        {" "}
        {/* Profile Card */}{" "}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
          <View style={styles.settingsCard}>
            {accountSettings.map(renderSettingItem)}
          </View>
        </View>
        {/* Support Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Dukungan</Text>
          <View style={styles.settingsCard}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>{" "}
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("token");
              Alert.alert("Berhasil", "Anda berhasil keluar dari aplikasi");
              // Reset user data
              setUser({
                name: "",
                email: "",
                username: "",
              });
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Gagal keluar dari aplikasi");
            }
          }}
        >
          <Feather
            name="log-out"
            size={18}
            color="#EF4444"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Versi 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 16,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primaryBlue}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: colors.black,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#EF4444",
  },
  versionText: {
    fontSize: 12,
    color: colors.grayTwo,
    textAlign: "center",
    marginBottom: 24,
  },
});
