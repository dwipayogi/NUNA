import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import Feather from "@expo/vector-icons/Feather";

import { Input } from "@/components/input";

import { colors } from "@/constants/colors";
import {
  getAllJournals,
  createJournal,
  Journal,
  getMoodColor,
} from "@/services/journalService";

export default function JournalScreen() {
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("semua catatan");

  const promptModalAnim = useRef(new Animated.Value(0)).current;

  // Fetch journals when component mounts
  useEffect(() => {
    fetchJournals();
  }, []);
  // Function to fetch journals from API
  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllJournals();
      setJournals(data);
    } catch (err: any) {
      setError(err.message || "Failed to load journals");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setShowPromptModal(true);
    Animated.timing(promptModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const hideModal = () => {
    Animated.timing(promptModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPromptModal(false);
      setSelectedMood(null); // Reset selected mood when closing modal
    });
  };

  const formatDate = (dateString: string) => {
    const options = {
      weekday: "short" as const,
      month: "short" as const,
      day: "numeric" as const,
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const router = useRouter();
  const renderJournalEntry = ({ item }: { item: Journal }) => {
    const color = getMoodColor(item.mood);
    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => {
          router.push({
            pathname: `/(tabs)/journal/[id]`,
            params: { id: item.id },
          });
        }}
      >
        <View style={[styles.entryMoodIndicator, { backgroundColor: color }]} />
        <View style={styles.entryContent}>
          <Text style={styles.entryDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.entryTitle}>{item.title}</Text>
          <Text style={styles.entryPreview} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.entryFooter}>
            <View style={[styles.moodTag, { backgroundColor: `${color}20` }]}>
              <Text style={[styles.moodText, { color: color }]}>
                {item.mood}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Catatan Harian</Text>
        </View>
        {/* Tabs for insights and journal entries */}
        <View style={styles.tabsContainer}>
          <ScrollableTab
            tabs={["Semua Catatan", "Mood Analytics", "Insights", "Tips"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
          </View>
        ) : activeTab === "semua catatan" ? (
          journals.length > 0 ? (
            <FlatList
              data={journals}
              renderItem={renderJournalEntry}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.entriesList}
              showsVerticalScrollIndicator={false}
              refreshing={loading}
              onRefresh={fetchJournals}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Belum ada catatan. Tambahkan catatan baru!
              </Text>
            </View>
          )
        ) : activeTab === "mood analytics" ? (
          <ScrollView contentContainerStyle={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Feather
                  name="bar-chart-2"
                  size={20}
                  color={colors.primaryBlue}
                />
                <Text style={styles.insightTitle}>Analisis Mood</Text>
              </View>
              <Text style={styles.insightDescription}>
                Berdasarkan catatan Anda, mood yang paling sering Anda alami
                adalah <Text style={styles.highlightText}>Produktif</Text> dan{" "}
                <Text style={styles.highlightText}>Tenang</Text>.
              </Text>

              <View style={styles.moodDistribution}>
                <View style={styles.moodBarContainer}>
                  <Text style={styles.moodBarLabel}>Senang</Text>
                  <View style={styles.moodBarWrapper}>
                    <View
                      style={[
                        styles.moodBar,
                        { width: "30%", backgroundColor: "#4ADE80" },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodBarPercentage}>30%</Text>
                </View>

                <View style={styles.moodBarContainer}>
                  <Text style={styles.moodBarLabel}>Tenang</Text>
                  <View style={styles.moodBarWrapper}>
                    <View
                      style={[
                        styles.moodBar,
                        { width: "25%", backgroundColor: "#60A5FA" },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodBarPercentage}>25%</Text>
                </View>

                <View style={styles.moodBarContainer}>
                  <Text style={styles.moodBarLabel}>Produktif</Text>
                  <View style={styles.moodBarWrapper}>
                    <View
                      style={[
                        styles.moodBar,
                        { width: "35%", backgroundColor: "#34D399" },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodBarPercentage}>35%</Text>
                </View>

                <View style={styles.moodBarContainer}>
                  <Text style={styles.moodBarLabel}>Stres</Text>
                  <View style={styles.moodBarWrapper}>
                    <View
                      style={[
                        styles.moodBar,
                        { width: "10%", backgroundColor: "#FB7185" },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodBarPercentage}>10%</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : activeTab === "insights" ? (
          <ScrollView contentContainerStyle={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Feather name="zap" size={20} color={colors.primaryBlue} />
                <Text style={styles.insightTitle}>Wawasan AI</Text>
              </View>
              <Text style={styles.insightDescription}>
                Berdasarkan analisis dari catatan Anda, AI kami menemukan
                beberapa pola:
              </Text>

              <View style={styles.insightList}>
                <View style={styles.insightItem}>
                  <Feather
                    name="check-circle"
                    size={16}
                    color={colors.primaryBlue}
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    Anda lebih produktif di pagi hari, terutama setelah kegiatan
                    olahraga.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="check-circle"
                    size={16}
                    color={colors.primaryBlue}
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    Mood Anda cenderung menurun setelah menghabiskan waktu di
                    media sosial lebih dari 1 jam.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="check-circle"
                    size={16}
                    color={colors.primaryBlue}
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    Ada korelasi positif antara waktu tidur yang cukup dan
                    tingkat energi Anda.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Feather
                  name="trending-up"
                  size={20}
                  color={colors.primaryBlue}
                />
                <Text style={styles.insightTitle}>Perkembangan</Text>
              </View>
              <Text style={styles.insightDescription}>
                Dalam 30 hari terakhir, terdapat peningkatan 20% dalam catatan
                mood positif Anda. Ini menunjukkan perkembangan yang baik dalam
                kesejahteraan mental Anda.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Feather name="coffee" size={20} color={colors.primaryBlue} />
                <Text style={styles.insightTitle}>Tips Kesehatan Mental</Text>
              </View>

              <View style={styles.insightList}>
                <View style={styles.insightItem}>
                  <Feather
                    name="sun"
                    size={16}
                    color="#FACC15"
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    <Text style={styles.boldText}>Rutinitas Pagi</Text>:
                    Mulailah hari dengan meditasi singkat 5 menit untuk
                    menjernihkan pikiran.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="activity"
                    size={16}
                    color="#10B981"
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    <Text style={styles.boldText}>Aktivitas Fisik</Text>:
                    Tetapkan target 20 menit olahraga ringan setiap hari.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="moon"
                    size={16}
                    color="#818CF8"
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    <Text style={styles.boldText}>Tidur Berkualitas</Text>:
                    Kurangi penggunaan gawai 1 jam sebelum tidur untuk
                    meningkatkan kualitas istirahat.
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="users"
                    size={16}
                    color="#F87171"
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    <Text style={styles.boldText}>Koneksi Sosial</Text>:
                    Luangkan waktu untuk berinteraksi dengan orang-orang
                    terdekat minimal 30 menit sehari.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Feather
                  name="book-open"
                  size={20}
                  color={colors.primaryBlue}
                />
                <Text style={styles.insightTitle}>Rekomendasi Bacaan</Text>
              </View>
              <Text style={styles.insightDescription}>
                Berdasarkan catatan Anda, berikut beberapa buku yang mungkin
                membantu:
              </Text>

              <View style={styles.insightList}>
                <View style={styles.insightItem}>
                  <Feather
                    name="bookmark"
                    size={16}
                    color={colors.primaryBlue}
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    "Atomic Habits" oleh James Clear
                  </Text>
                </View>

                <View style={styles.insightItem}>
                  <Feather
                    name="bookmark"
                    size={16}
                    color={colors.primaryBlue}
                    style={styles.insightItemIcon}
                  />
                  <Text style={styles.insightItemText}>
                    "Mindfulness in Plain English" oleh Bhante Gunaratana
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        <TouchableOpacity style={styles.newEntryButton} onPress={showModal}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {showPromptModal && (
          <Animated.View
            style={[
              styles.promptModalContainer,
              {
                opacity: promptModalAnim,
                transform: [
                  {
                    translateY: promptModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.promptModal}>
              <View style={styles.promptModalHeader}>
                <Text style={styles.promptModalTitle}>Buat catatan baru</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={hideModal}
                >
                  <Feather name="x" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>{" "}
              <Text style={styles.promptModalSubtitle}>Judul</Text>
              <Input
                placeholder="Tulis catatan baru..."
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.promptModalSubtitle}>Isi</Text>
              <Input
                placeholder="Ceritakan hari Anda..."
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
              />
              <Text style={styles.promptModalSubtitle}>Mood</Text>{" "}
              <View style={styles.moodSelector}>
                {[
                  "Senang",
                  "Tenang",
                  "Produktif",
                  "Netral",
                  "Cemas",
                  "Stres",
                  "Sedih",
                ].map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodOption,
                      selectedMood === mood && styles.selectedMoodOption,
                    ]}
                    onPress={() => setSelectedMood(mood)}
                  >
                    <Text
                      style={[
                        styles.moodOptionText,
                        selectedMood === mood && styles.selectedMoodOptionText,
                      ]}
                    >
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>{" "}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={async () => {
                  if (!title.trim() || !content.trim() || !selectedMood) {
                    return;
                  }

                  try {
                    setLoading(true);
                    await createJournal({
                      title,
                      content,
                      mood: selectedMood,
                    });

                    // Reset form and hide modal
                    setTitle("");
                    setContent("");
                    setSelectedMood(null);
                    hideModal();

                    // Refresh journals list
                    fetchJournals();
                  } catch (err: any) {
                    console.error("Error creating journal:", err);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Text style={styles.submitButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ScrollableTab component
function ScrollableTab({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <FlatList
      data={tabs}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const isActive = activeTab === item.toLowerCase();
        return (
          <TouchableOpacity
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(item.toLowerCase())}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.tabsContent}
    />
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
  entriesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  entryCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  entryMoodIndicator: {
    width: 4,
    height: "100%",
  },
  entryContent: {
    flex: 1,
    padding: 16,
  },
  entryDate: {
    fontSize: 12,
    color: colors.grayTwo,
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 12,
  },
  entryFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moodText: {
    fontSize: 12,
  },
  newEntryButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  promptModalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  promptModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "80%",
  },
  promptModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  promptModalTitle: {
    fontSize: 18,
    color: "#1E293B",
  },
  promptModalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  moodSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
  },
  moodOption: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  moodOptionText: {
    fontSize: 14,
    color: "#475569",
  },
  selectedMoodOption: {
    backgroundColor: colors.primaryBlue,
  },
  selectedMoodOptionText: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grayTwo,
    textAlign: "center",
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primaryBlue,
  },
  tabText: {
    fontSize: 14,
    color: colors.primaryBlue,
  },
  activeTabText: {
    color: colors.white,
  },
  insightsContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 16,
    lineHeight: 20,
  },
  highlightText: {
    color: colors.primaryBlue,
    fontWeight: "600",
  },
  moodDistribution: {
    marginTop: 16,
  },
  moodBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  moodBarLabel: {
    width: 70,
    fontSize: 14,
    color: colors.grayTwo,
  },
  moodBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  moodBar: {
    height: "100%",
    borderRadius: 4,
  },
  moodBarPercentage: {
    width: 40,
    fontSize: 14,
    color: colors.grayTwo,
    textAlign: "right",
  },
  insightList: {
    marginTop: 4,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  insightItemIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  insightItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.grayTwo,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "600",
    color: colors.black,
  },
});
