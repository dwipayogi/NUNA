import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";

// Sample meditation sessions
const MEDITATION_SESSIONS = [
  {
    id: "1",
    title: "Fokus Tenang",
    description: "Tingkatkan konsentrasi untuk sesi belajar",
    duration: "10 menit",
    image:
      "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#3B82F6",
  },
  {
    id: "2",
    title: "Mengurangi Stres",
    description: "Hilangkan ketegangan dan kecemasan",
    duration: "15 menit",
    image:
      "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#FACC15",
  },
  {
    id: "3",
    title: "Tidur Nyenyak",
    description: "Persiapkan pikiran untuk tidur yang nyenyak",
    duration: "20 menit",
    image:
      "https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#7C3AED",
  },
  {
    id: "4",
    title: "Reset Cepat",
    description: "Mindfulness cepat untuk hari yang sibuk",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#10B981",
  },
];

// Contoh latihan pernapasan
const BREATHING_EXERCISES = [
  {
    id: "1",
    title: "Pernapasan 4-7-8",
    description: "Tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#3B82F6",
  },
  {
    id: "2",
    title: "Pernapasan Kotak",
    description: "Waktu yang sama untuk tarik napas, tahan, hembuskan, dan jeda",
    duration: "5 menit",
    image:
      "https://images.pexels.com/photos/1834407/pexels-photo-1834407.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#FACC15",
  },
  {
    id: "3",
    title: "Diafragma",
    description: "Pernapasan perut dalam untuk relaksasi",
    duration: "10 menit",
    image:
      "https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=600",
    color: "#EC4899",
  },
];

export default function MeditateScreen() {
  const [activeTab, setActiveTab] = useState("meditasi");
  const router = useRouter();

  const data =
    activeTab === "meditasi" ? MEDITATION_SESSIONS : BREATHING_EXERCISES;

  // Function to navigate to detail page
  const goToSessionDetail = (sessionId: string) => {
    router.push({
      pathname: "/(tabs)/meditate/[id]",
      params: {
        id: sessionId,
        type: activeTab,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditasi</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "meditasi" && styles.activeTab]}
          onPress={() => setActiveTab("meditasi")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "meditasi" && styles.activeTabText,
            ]}
          >
            Meditasi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pernafasan" && styles.activeTab]}
          onPress={() => setActiveTab("pernafasan")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pernafasan" && styles.activeTabText,
            ]}
          >
            Pernafasan
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {data.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => goToSessionDetail(item.id)}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  imageStyle={styles.cardImageStyle}
                >
                  <View
                    style={[
                      styles.cardOverlay,
                      { backgroundColor: `${item.color}40` },
                    ]}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                    <Text style={styles.cardDuration}>{item.duration}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {activeTab === "meditasi"
            ? "Rekomendasi Untuk Anda"
            : "Latihan Populer"}
        </Text>

        <View style={styles.recommendedContainer}>
          {data.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={`rec-${item.id}`}
              style={styles.recommendedCard}
              onPress={() => goToSessionDetail(item.id)}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.recommendedImage}
                imageStyle={styles.recommendedImageStyle}
              >
                <View
                  style={[
                    styles.cardOverlay,
                    { backgroundColor: `${item.color}40` },
                  ]}
                />
                <View style={styles.recommendedContent}>
                  <Text style={styles.recommendedTitle}>{item.title}</Text>
                  <View style={styles.recommendedMeta}>
                    <Text style={styles.recommendedDuration}>
                      {item.duration}
                    </Text>
                    <View style={styles.recommendedInfo}>
                      <Feather name="info" size={12} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    color: "#64748B",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 180,
  },
  cardImage: {
    height: "100%",
    justifyContent: "flex-end",
  },
  cardImageStyle: {
    borderRadius: 16,
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  cardContent: {
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 4,
  },
  cardDuration: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 16,
  },
  recommendedContainer: {
    marginBottom: 16,
  },
  recommendedCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 120,
  },
  recommendedImage: {
    height: "100%",
    justifyContent: "flex-end",
  },
  recommendedImageStyle: {
    borderRadius: 16,
  },
  recommendedContent: {
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  recommendedMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedDuration: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  recommendedInfo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
