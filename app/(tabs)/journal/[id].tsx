import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";

import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants/colors";
import { Input } from "@/components/input";
import {
  getJournalById,
  updateJournal,
  deleteJournal,
  getMoodColor,
  Journal,
} from "@/services/journalService";

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [error, setError] = useState("");

  const editModalAnim = useRef(new Animated.Value(0)).current;

  // Fetch journal details when component mounts
  useEffect(() => {
    fetchJournalDetails();
  }, [id]);

  const fetchJournalDetails = async () => {
    if (!id) {
      setError("Journal ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getJournalById(id as string);
      setJournal(data);

      // Pre-populate edit form
      setEditTitle(data.title);
      setEditContent(data.content);
      setSelectedMood(data.mood);
    } catch (err: any) {
      setError(err.message || "Failed to load journal details");
      Alert.alert("Error", "Failed to load journal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const showModal = () => {
    setShowEditModal(true);
    Animated.timing(editModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(editModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEditModal(false);
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim() || !selectedMood) {
      Alert.alert("Error", "Harap isi semua kolom (judul, isi, dan mood)");
      return;
    }

    try {
      setLoading(true);
      const updatedJournal = await updateJournal(id as string, {
        title: editTitle,
        content: editContent,
        mood: selectedMood,
      });

      setJournal(updatedJournal);
      hideModal();
      Alert.alert("Sukses", "Catatan berhasil diperbarui");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Gagal memperbarui catatan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus catatan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteJournal(id as string);
              Alert.alert("Sukses", "Catatan berhasil dihapus");
              router.back();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Gagal menghapus catatan");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
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
          <Text style={styles.headerTitle}>Detail Catatan</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      </SafeAreaView>
    );
  }

  if (!journal || error) {
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
          <Text style={styles.headerTitle}>Detail Catatan</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Catatan tidak ditemukan</Text>
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
        <Text style={styles.headerTitle}>Detail Catatan</Text>
        <TouchableOpacity style={styles.editButton} onPress={showModal}>
          <Feather name="edit-2" size={20} color={colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(journal.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{journal.title}</Text>

        <View
          style={[
            styles.moodTag,
            { backgroundColor: `${getMoodColor(journal.mood)}20` },
          ]}
        >
          <Text
            style={[styles.moodText, { color: getMoodColor(journal.mood) }]}
          >
            {journal.mood}
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.content}>{journal.content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color="#EF4444" />
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      {showEditModal && (
        <Animated.View
          style={[
            styles.editModalContainer,
            {
              opacity: editModalAnim,
              transform: [
                {
                  translateY: editModalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Catatan</Text>
              <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.editModalSubtitle}>Judul</Text>
            <Input
              placeholder="Judul catatan"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <Text style={styles.editModalSubtitle}>Isi</Text>
            <Input
              placeholder="Ceritakan hari Anda..."
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
              value={editContent}
              onChangeText={setEditContent}
            />
            <Text style={styles.editModalSubtitle}>Mood</Text>
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
              onPress={handleSaveEdit}
            >
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
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
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 80,
  },
  dateContainer: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.grayTwo,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 12,
  },
  moodTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  moodText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: "#EF4444",
    fontWeight: "600",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.grayTwo,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editModalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  editModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "80%",
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editModalTitle: {
    fontSize: 18,
    color: "#1E293B",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryBlue,
    marginBottom: 8,
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
});
