import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Selamat Pagi!");
  const [username, setUsername] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Selamat Pagi!";
      if (hour < 18) return "Selamat Siang!";
      return "Selamat Malam!";
    };

    setGreeting(getGreeting());

    // Fetch username, token and active mood
    const getUserData = async () => {
      try {
        // Get user data from AsyncStorage
        const userDataString = await AsyncStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUsername(userData.username || "");
        }

        // Get token from storage
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        // Fetch active mood from API
        try {
          const response = await fetch(
            "https://nuna.yogserver.web.id/api/mood-history/active",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const activeMood = await response.json();
            if (activeMood && activeMood.mood) {
              setSelectedMood(activeMood.mood);
              await AsyncStorage.setItem("currentMood", activeMood.mood);
            }
          } else {
            // If no active mood or error, try to get from local storage
            const savedMood = await AsyncStorage.getItem("currentMood");
            if (savedMood) {
              setSelectedMood(savedMood);
            }
          }
        } catch (apiError) {
          console.error("Error fetching active mood:", apiError);

          // Fallback to local storage
          const savedMood = await AsyncStorage.getItem("currentMood");
          if (savedMood) {
            setSelectedMood(savedMood);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const saveMood = async (mood: string) => {
    try {
      const previousMood = selectedMood;
      setSelectedMood(mood);
      await AsyncStorage.setItem("currentMood", mood);

      // Get token from storage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      // Creating a new mood entry will automatically end any active mood entry
      // according to the API documentation
      await fetch("https://nuna.yogserver.web.id/api/mood-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood,
        }),
      });
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
                  onPress={() => saveMood(mood)}
                >
                  <View
                    style={[
                      styles.moodEmoji,
                      { backgroundColor: getMoodColor(mood) },
                      selectedMood === mood && styles.selectedMoodEmoji,
                    ]}
                  >
                    <Text style={styles.emojiText}>{getMoodEmoji(mood)}</Text>
                  </View>
                  <Text
                    style={[
                      styles.moodText,
                      selectedMood === mood && styles.selectedMoodText,
                    ]}
                  >
                    {mood}
                  </Text>
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

          {/* Emergency Contact Button */}
          <TouchableOpacity
            style={styles.emergencyContactButton}
            onPress={() => router.push("/emergency-contacts")}
          >
            <View style={styles.emergencyButtonContent}>
              <Feather name="phone-call" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>Kontak Darurat</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  selectedMoodEmoji: {
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    transform: [{ scale: 1.1 }],
  },
  selectedMoodText: {
    fontWeight: "600",
    color: colors.primaryBlue,
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
  emergencyContactButton: {
    backgroundColor: "#EF4444", // Red color for emergency
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 12,
  },
});
