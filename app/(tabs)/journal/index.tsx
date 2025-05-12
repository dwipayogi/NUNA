import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
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
  const [activeTab, setActiveTab] = useState("catatan");
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

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
      Alert.alert("Error", "Failed to load journals. Please try again.");
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catatan Harian</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "catatan" && styles.activeTab]}
          onPress={() => setActiveTab("catatan")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "catatan" && styles.activeTabText,
            ]}
          >
            Catatan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stats" && styles.activeTab]}
          onPress={() => setActiveTab("stats")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "stats" && styles.activeTabText,
            ]}
          >
            Analisis
          </Text>
        </TouchableOpacity>
      </View>{" "}
      {activeTab === "catatan" ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
          </View>
        ) : journals.length > 0 ? (
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
      ) : (
        <ScrollView
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>Monthly Overview</Text>
            <Text style={styles.statsCardSubtitle}>June 2025</Text>

            <View style={styles.calendarPlaceholder}>
              <Text style={styles.placeholderText}>
                Calendar view will be displayed here
              </Text>
            </View>

            <View style={styles.moodSummary}>
              <Text style={styles.moodSummaryTitle}>Mood Summary</Text>
              <View style={styles.moodDistribution}>
                <View style={styles.moodPercentage}>
                  <View
                    style={[
                      styles.moodPercentBar,
                      { backgroundColor: "#4ADE80", width: "40%" },
                    ]}
                  />
                  <Text style={styles.moodPercentText}>Positive: 40%</Text>
                </View>
                <View style={styles.moodPercentage}>
                  <View
                    style={[
                      styles.moodPercentBar,
                      { backgroundColor: "#FACC15", width: "30%" },
                    ]}
                  />
                  <Text style={styles.moodPercentText}>Neutral: 30%</Text>
                </View>
                <View style={styles.moodPercentage}>
                  <View
                    style={[
                      styles.moodPercentBar,
                      { backgroundColor: "#F87171", width: "30%" },
                    ]}
                  />
                  <Text style={styles.moodPercentText}>Negative: 30%</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topicsCard}>
            <Text style={styles.statsCardTitle}>Topik Umum</Text>
            <View style={styles.topicTags}>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>ujian</Text>
              </View>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>stres</Text>
              </View>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>tidur</Text>
              </View>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>teman</Text>
              </View>
              <View style={styles.topicTag}>
                <Text style={styles.topicTagText}>proyek</Text>
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
              <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
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
                  Alert.alert(
                    "Error",
                    "Harap isi semua kolom (judul, isi, dan mood)"
                  );
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
                  Alert.alert("Sukses", "Catatan berhasil disimpan");
                } catch (err: any) {
                  Alert.alert(
                    "Error",
                    err.message || "Gagal menyimpan catatan"
                  );
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primaryBlue,
  },
  tabText: {
    fontSize: 14,
    color: colors.primaryBlue,
  },
  activeTabText: {
    color: colors.backgroundBlue,
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
  statsContainer: {
    flex: 1,
  },
  statsContent: {
    padding: 16,
    paddingBottom: 80,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsCardTitle: {
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 4,
  },
  statsCardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  calendarPlaceholder: {
    height: 200,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: "#64748B",
  },
  moodSummary: {
    marginTop: 8,
  },
  moodSummaryTitle: {
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
  },
  moodDistribution: {
    marginTop: 8,
  },
  moodPercentage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  moodPercentBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  moodPercentText: {
    fontSize: 14,
    color: "#475569",
  },
  topicsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topicTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  topicTag: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  topicTagText: {
    fontSize: 14,
    color: "#475569",
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
});
