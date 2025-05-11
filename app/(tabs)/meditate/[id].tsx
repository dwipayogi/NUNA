import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";

// Sample meditation sessions
const MEDITATION_SESSIONS = [
  {
    id: "1",
    title: "Fokus Tenang",
    description: "Meningkatkan konsentrasi untuk sesi belajar",
    longDescription:
      "Meditasi ini membantu Anda mengembangkan fokus mendalam dengan membimbing Anda melalui teknik untuk membersihkan pikiran dari gangguan. Cocok untuk sebelum sesi belajar atau ujian ketika Anda perlu berkonsentrasi sepenuhnya.",
    duration: "10 menit",
    image:
      "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#3B82F6",
    steps: [
      "Cari tempat yang tenang untuk duduk dengan nyaman",
      "Tutup mata Anda dan ambil 3 napas dalam",
      "Fokuskan perhatian Anda pada pernapasan",
      "Ketika pikiran Anda melayang, bawa kembali dengan lembut ke napas Anda",
      "Lanjutkan selama durasi sesi",
    ],
  },
  {
    id: "2",
    title: "Pelepasan Stres",
    description: "Menghilangkan ketegangan dan kecemasan",
    longDescription:
      "Meditasi terpandu ini berfokus pada pelepasan stres dan kecemasan yang menumpuk. Melalui visualisasi dan teknik pernapasan, Anda akan belajar melepaskan ketegangan di tubuh Anda dan menenangkan pikiran yang gelisah.",
    duration: "15 menit",
    image:
      "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#FACC15",
    steps: [
      "Berbaring atau duduk dalam posisi yang nyaman",
      "Tutup mata Anda dan mulai perhatikan napas Anda",
      "Pindai tubuh Anda untuk area yang tegang",
      "Bayangkan bernapas dengan rileks ke area yang tegang",
      "Biarkan pikiran Anda melepaskan kekhawatiran",
    ],
  },
  {
    id: "3",
    title: "Tidur Nyenyak",
    description: "Mempersiapkan pikiran untuk tidur yang nyenyak",
    longDescription:
      "Dirancang untuk membantu Anda beralih dari hari yang sibuk ke tidur yang memulihkan. Meditasi ini menggunakan pemindaian tubuh dan pernapasan lembut untuk menenangkan sistem saraf Anda dan mempersiapkan tidur yang dalam dan menyegarkan.",
    duration: "20 menit",
    image:
      "https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#7C3AED",
    steps: [
      "Berbaring di tempat tidur Anda dalam posisi yang nyaman",
      "Mulailah dengan mengambil napas yang lambat dan dalam",
      "Rasakan tubuh Anda menjadi berat dan rileks",
      "Biarkan pikiran Anda melayang dan lepaskan pikiran hari ini",
      "Lanjutkan bernapas dalam-dalam hingga Anda tertidur",
    ],
  },
  {
    id: "4",
    title: "Reset Cepat",
    description: "Mindfulness cepat untuk hari yang sibuk",
    longDescription:
      "Meditasi singkat namun kuat yang dirancang untuk masuk ke jadwal yang sibuk. Dalam waktu hanya 5 menit, Anda akan belajar mereset keadaan mental Anda, mengurangi stres, dan kembali ke hari Anda dengan kejernihan dan fokus baru.",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#10B981",
    steps: [
      "Cari tempat yang tenang dan duduk dengan nyaman",
      "Ambil 3 napas dalam",
      "Fokus pada saat ini",
      "Akui pikiran Anda tanpa penilaian",
      "Kembali ke hari Anda dengan fokus baru",
    ],
  },
];

// Contoh latihan pernapasan
const BREATHING_EXERCISES = [
  {
    id: "1",
    title: "Pernapasan 4-7-8",
    description: "Tarik napas selama 4, tahan selama 7, buang napas selama 8",
    longDescription:
      "Teknik pernapasan 4-7-8 dirancang untuk mengurangi kecemasan dan membantu Anda tidur. Pola ini bertindak sebagai penenang alami untuk sistem saraf, membantu dengan cepat mengurangi ketegangan dan mempromosikan relaksasi.",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#3B82F6",
    steps: [
      "Duduk dengan nyaman dengan punggung lurus",
      "Tarik napas perlahan melalui hidung selama hitungan 4",
      "Tahan napas Anda selama hitungan 7",
      "Buang napas sepenuhnya melalui mulut selama hitungan 8",
      "Ulangi 3-4 kali",
    ],
  },
  {
    id: "2",
    title: "Pernapasan Kotak",
    description: "Waktu yang sama untuk tarik napas, tahan, buang napas, dan jeda",
    longDescription:
      "Pernapasan kotak adalah teknik kuat yang digunakan oleh atlet, personel militer, dan praktisi yoga untuk meningkatkan konsentrasi dan kinerja. Teknik ini menciptakan ritme yang membantu mengatur sistem saraf otonom Anda.",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/1834407/pexels-photo-1834407.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#FACC15",
    steps: [
      "Duduk tegak dalam posisi yang nyaman",
      "Buang napas perlahan melalui mulut Anda",
      "Tarik napas melalui hidung selama hitungan 4",
      "Tahan napas Anda selama hitungan 4",
      "Buang napas melalui mulut selama hitungan 4",
      "Jeda selama hitungan 4 sebelum menarik napas lagi",
      "Ulangi selama beberapa menit",
    ],
  },
  {
    id: "3",
    title: "Pernapasan Diafragma",
    description: "Pernapasan perut dalam untuk relaksasi",
    longDescription:
      "Pernapasan diafragma, atau pernapasan perut, dirancang untuk membantu Anda menggunakan diafragma dengan benar saat bernapas. Teknik ini membantu memperkuat diafragma Anda, mengurangi stres, dan meningkatkan stabilitas otot inti.",
    duration: "10 menit",
    image:
      "https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#EC4899",
    steps: [
      "Berbaring telentang dengan lutut sedikit ditekuk",
      "Letakkan satu tangan di dada Anda dan yang lainnya di perut Anda",
      "Tarik napas perlahan melalui hidung, rasakan perut Anda mengembang",
      "Dada Anda harus tetap relatif diam",
      "Buang napas perlahan melalui bibir yang mengerucut",
      "Ulangi selama 5-10 menit",
    ],
  },
];

export default function MeditationDetailScreen() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Determine if we're showing a meditation or breathing exercise
  const allSessions =
    type === "breathe" ? BREATHING_EXERCISES : MEDITATION_SESSIONS;
  const session = allSessions.find((s) => s.id === id);

  useEffect(() => {
    if (session) {
      // Convert duration string like "10 min" to seconds (600)
      const durationInMinutes = parseInt(session.duration.split(" ")[0]);
      setTotalTime(durationInMinutes * 60);
    }
  }, [session]);

  // Format time display (e.g., convert 75 seconds to "01:15")
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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

  if (!session) {
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
          <Text style={styles.notFoundText}>Sesi tidak ditemukan</Text>
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
          source={{ uri: session.image }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View
            style={[styles.overlay, { backgroundColor: `${session.color}60` }]}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{session.title}</Text>
            <Text style={styles.heroDuration}>{session.duration}</Text>
          </View>
        </ImageBackground>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Tentang sesi ini</Text>
          <Text style={styles.descriptionText}>{session.longDescription}</Text>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Cara berlatih</Text>
          {session.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[styles.stepNumber, { backgroundColor: session.color }]}
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
                  backgroundColor: session.color,
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
            style={[styles.playPauseButton, { backgroundColor: session.color }]}
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
