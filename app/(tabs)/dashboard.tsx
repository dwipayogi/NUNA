import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Selamat Pagi!");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Selamat Pagi!";
      if (hour < 18) return "Selamat Siang!";
      return "Selamat Malam!";
    };

    setGreeting(getGreeting());

    // Fetch username from AsyncStorage
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUsername(userData.username || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>{username || "User"}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/profile")}
            >
              <Feather name="user" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.moodTrackerContainer}>
          <Text style={styles.sectionTitle}>
            Bagaimana perasaanmu hari ini?
          </Text>
          <View style={styles.moodRow}>
            {["Hebat", "Baik", "Oke", "Buruk", "Sangat Buruk"].map(
              (mood, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.moodItem}
                  onPress={() => {
                    /* Mood tracking logic */
                  }}
                >
                  <View
                    style={[
                      styles.moodEmoji,
                      { backgroundColor: getMoodColor(mood) },
                    ]}
                  >
                    <Text style={styles.emojiText}>{getMoodEmoji(mood)}</Text>
                  </View>
                  <Text style={styles.moodText}>{mood}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        <View style={styles.tipContainer}>
          <View style={styles.tipHeader}>
            <Feather name="info" size={24} color={colors.primaryYellow} />
            <Text style={styles.tipTitle}>Tips hari ini</Text>
          </View>
          <Text style={styles.tipDescription}>
            "Luangkan waktu sejenak untuk bernapas dan merenungkan harimu.
            Ingat, tidak apa-apa merasakan apa pun yang sedang kamu rasakan."
          </Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/journal/")}
            >
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: "#EBF5FF" },
                ]}
              >
                <Feather name="book" color="#3B82F6" size={24} />
              </View>
              <Text style={styles.cardTitle}>Buat Catatan</Text>
              <Text style={styles.cardDescription}>
                Catat pikiran dan perasaanmu
              </Text>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" color="#3B82F6" size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/meditate")}
            >
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: "#FEF9C3" },
                ]}
              >
                <Feather name="heart" color="#FACC15" size={24} />
              </View>
              <Text style={styles.cardTitle}>Meditasi</Text>
              <Text style={styles.cardDescription}>
                Latih dirimu untuk tenang
              </Text>
              <View style={styles.cardAction}>
                <Feather name="chevron-right" color="#3B82F6" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions
function getMoodEmoji(mood: string) {
  switch (mood) {
    case "Hebat":
      return "😄";
    case "Baik":
      return "🙂";
    case "Oke":
      return "😐";
    case "Buruk":
      return "😕";
    case "Sangat Buruk":
      return "😞";
    default:
      return "😐";
  }
}

function getMoodColor(mood: string) {
  switch (mood) {
    case "Hebat":
      return "#4ADE80";
    case "Baik":
      return "#93C5FD";
    case "Oke":
      return "#FACC15";
    case "Buruk":
      return "#FB923C";
    case "Sangat Buruk":
      return "#F87171";
    default:
      return "#CBD5E1";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: colors.grayTwo,
    fontWeight: "500",
  },
  name: {
    fontSize: 24,
    color: colors.black,
    fontWeight: "bold",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  moodTrackerContainer: {
    marginBottom: 24,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  moodItem: {
    alignItems: "center",
  },
  moodEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 20,
  },
  moodText: {
    fontSize: 12,
    color: "#475569",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1E293B",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3B82F6",
  },
  tipContainer: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: colors.primaryBlue,
    borderRadius: 16,
  },
  tipHeader: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "600",
  },
  tipDescription: {
    fontSize: 14,
    color: colors.white,
    textAlign: "justify",
    marginBottom: 8,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 16,
  },
  cardAction: {
    alignSelf: "flex-end",
  },
  spacer: {
    height: 40,
  },
});
