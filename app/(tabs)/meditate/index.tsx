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
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import {
  getAllMeditations,
  Meditation,
  categorizeMeditations,
} from "@/services/meditateService";

export default function MeditateScreen() {
  const [activeTab, setActiveTab] = useState("meditasi");
  const [meditations, setMeditations] = useState<{
    meditasi: Meditation[];
    pernafasan: Meditation[];
  }>({ meditasi: [], pernafasan: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch meditations when component mounts
  useEffect(() => {
    fetchMeditations();
  }, []);

  // Function to fetch meditations from API
  const fetchMeditations = async () => {
    try {
      setLoading(true);
      setError("");
      const meditationsData = await getAllMeditations();

      // Categorize meditations
      const categorized = categorizeMeditations(meditationsData);
      setMeditations(categorized);
    } catch (err: any) {
      setError(err.message || "Failed to load meditation sessions");
      Alert.alert(
        "Error",
        "Failed to load meditation sessions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get the data based on the active tab
  const data =
    activeTab === "meditasi" ? meditations.meditasi : meditations.pernafasan;

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
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditasi</Text>
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
      </View>{" "}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
            <Text style={styles.loadingText}>Memuat meditasi...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchMeditations}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {data.map((item) => (
                <View key={item.id} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => goToSessionDetail(item.id)}
                  >
                    <ImageBackground
                      source={{ uri: item.imageUrl }}
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
                        <Text style={styles.cardDuration}>{`${Math.floor(
                          item.duration / 60
                        )} menit`}</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {data.length > 0 && (
              <>
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
                        source={{ uri: item.imageUrl }}
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
                          <Text style={styles.recommendedTitle}>
                            {item.title}
                          </Text>
                          <View style={styles.recommendedMeta}>
                            {" "}
                            <Text style={styles.recommendedDuration}>
                              {`${Math.floor(item.duration / 60)} menit`}
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
              </>
            )}
          </>
        )}
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.grayTwo,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryBlue,
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
