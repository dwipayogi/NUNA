import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
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

// Import components
import { JournalEntriesTab, AIAnalyticsTab, ScrollableTab } from "./components";

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
  const router = useRouter();

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
  // Render the active tab content
  const renderActiveTabContent = () => {
    if (loading && activeTab === "semua catatan") {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      );
    }

    switch (activeTab) {
      case "semua catatan":
        return (
          <JournalEntriesTab
            journals={journals}
            loading={loading}
            fetchJournals={fetchJournals}
            renderJournalEntry={renderJournalEntry}
          />
        );
      case "analisis ai":
        return <AIAnalyticsTab />;
      default:
        return (
          <JournalEntriesTab
            journals={journals}
            loading={loading}
            fetchJournals={fetchJournals}
            renderJournalEntry={renderJournalEntry}
          />
        );
    }
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
        {/* Tabs for insights and journal entries */}{" "}
        <View style={styles.tabsContainer}>
          <ScrollableTab
            tabs={["Semua Catatan", "Analisis AI"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
        {/* Tab content */}
        {renderActiveTabContent()}
        {/* New entry button */}
        <TouchableOpacity style={styles.newEntryButton} onPress={showModal}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {/* Modal for adding new entries */}
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
              </View>

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

              <Text style={styles.promptModalSubtitle}>Mood</Text>
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
              </View>

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
  tabsContainer: {
    marginBottom: 16,
  },
});
