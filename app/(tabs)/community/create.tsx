import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";

export default function CreatePostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available tags for posts
  const availableTags = [
    "Kesehatan Mental",
    "Ujian",
    "Stres",
    "Motivasi",
    "Keseimbangan",
    "Manajemen Waktu",
    "Sosial",
    "Akademik",
    "Fokus",
    "Meditasi",
    "Kesejahteraan",
    "Wellness",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      // Limit to max 3 tags
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleSubmit = () => {
    if (title.trim() === "" || content.trim() === "") {
      // Show error
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would send this data to your backend
    // For demo purposes, we'll just simulate a delay and go back
    setTimeout(() => {
      setIsSubmitting(false);
      router.back(); // Navigate back to the community feed after posting
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="x" size={24} color={colors.primaryBlue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Postingan</Text>
          <TouchableOpacity
            style={[
              styles.submitButton,
              title.trim() === "" || content.trim() === "" || isSubmitting
                ? styles.submitButtonDisabled
                : null,
            ]}
            onPress={handleSubmit}
            disabled={
              title.trim() === "" || content.trim() === "" || isSubmitting
            }
          >
            <Text
              style={[
                styles.submitButtonText,
                title.trim() === "" || content.trim() === "" || isSubmitting
                  ? styles.submitButtonTextDisabled
                  : null,
              ]}
            >
              {isSubmitting ? "Posting..." : "Posting"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.contentInner}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.titleInput}
            placeholder="Judul postingan"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            placeholderTextColor="#94A3B8"
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Tulis postingan Anda di sini..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.tagsTitle}>
            Tambahkan Tag (maksimal 3){" "}
            <Text style={styles.tagCount}>{selectedTags.length}/3</Text>
          </Text>

          <View style={styles.tagsContainer}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagOption,
                  selectedTags.includes(tag) && styles.selectedTagOption,
                ]}
                onPress={() => toggleTag(tag)}
                disabled={
                  selectedTags.length >= 3 && !selectedTags.includes(tag)
                }
              >
                <Text
                  style={[
                    styles.tagOptionText,
                    selectedTags.includes(tag) && styles.selectedTagOptionText,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Panduan Komunitas</Text>
            <Text style={styles.guidelinesText}>
              • Hormati privasi orang lain
            </Text>
            <Text style={styles.guidelinesText}>
              • Jangan memposting konten yang melanggar hukum
            </Text>
            <Text style={styles.guidelinesText}>
              • Hindari ujaran kebencian dan perundungan
            </Text>
            <Text style={styles.guidelinesText}>
              • Berikan kritik yang konstruktif
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
    backgroundColor: colors.white,
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
  submitButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  submitButtonTextDisabled: {
    color: "#E2E8F0",
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  titleInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: colors.black,
  },
  contentInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    marginBottom: 16,
    color: colors.black,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  tagCount: {
    color: colors.grayTwo,
    fontWeight: "normal",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tagOption: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedTagOption: {
    backgroundColor: colors.primaryBlue,
  },
  tagOptionText: {
    fontSize: 14,
    color: colors.grayTwo,
  },
  selectedTagOptionText: {
    color: colors.white,
  },
  guidelines: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 4,
    lineHeight: 20,
  },
});
