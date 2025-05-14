import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import {
  getMeditationById,
  Meditation,
  formatTime,
} from "@/services/meditateService";

export default function MeditationDetailScreen() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch meditation data when component mounts
  useEffect(() => {
    fetchMeditationDetails();
  }, [id]);

  // Function to fetch meditation by ID
  const fetchMeditationDetails = async () => {
    if (!id) {
      setError("Meditation ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const meditationData = await getMeditationById(id as string);
      setMeditation(meditationData);
      setTotalTime(meditationData.duration);
    } catch (err: any) {
      setError(err.message || "Failed to load meditation details");
      Alert.alert(
        "Error",
        "Failed to load meditation details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (currentTime >= totalTime) {
      setIsPlaying(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, totalTime]);

  // Reset functionality
  const resetSession = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={colors.primaryBlue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {type === "pernafasan" ? "Pernafasan" : "Meditasi"}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Memuat meditasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meditation || error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={colors.primaryBlue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tidak Ditemukan</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {error || "Sesi tidak ditemukan"}
          </Text>
          {error && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchMeditationDetails}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === "pernafasan" ? "Pernafasan" : "Meditasi"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: meditation.imageUrl }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View
            style={[
              styles.overlay,
              { backgroundColor: `${meditation.color}60` },
            ]}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{meditation.title}</Text>
            <Text style={styles.heroDuration}>{`${Math.floor(
              meditation.duration / 60
            )} menit`}</Text>
          </View>
        </ImageBackground>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Tentang sesi ini</Text>
          <Text style={styles.descriptionText}>
            {meditation.longDescription}
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Cara berlatih</Text>
          {meditation.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepNumber,
                  { backgroundColor: meditation.color },
                ]}
              >
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.playerContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.timerText}>
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentTime / totalTime) * 100}%`,
                  backgroundColor: meditation.color,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={resetSession}>
            <Feather name="rotate-ccw" size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playPauseButton,
              { backgroundColor: meditation.color },
            ]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Feather
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Feather name="bookmark" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.grayTwo,
  },
  retryButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primaryBlue,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 100,
  },
  heroImage: {
    height: 200,
    justifyContent: "flex-end",
    position: "relative",
  },
  heroImageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroDuration: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  descriptionContainer: {
    padding: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },
  stepsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: "#64748B",
  },
});
