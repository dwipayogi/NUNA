import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import { Feather } from "@expo/vector-icons";

import { Input } from "@/components/input";
import { colors } from "@/constants/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState({ role: "user", message: "" });
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const scrollViewRef = useRef<ScrollView>(null);
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Then animated scroll after a short delay to ensure content is rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  async function sendMessage({ message }: { message: string }) {
    if (!message) return;
    const token = await AsyncStorage.getItem("token");

    setMessages((prevMessages) => [...prevMessages, { role: "user", message }]);
    const response = await fetch("https://nuna.yogserver.web.id/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "bot",
        message: data.content || data.message || "Response error",
      },
    ]);
  }
  // Template prompts that users can select
  const templatePrompts = [
    "Saya merasa stress",
    "Bagaimana cara mengelola kecemasan?",
    "Saya butuh tips belajar efektif",
    "Cara menjaga kesehatan mental",
  ];
  const handleTemplatePrompt = (prompt: string) => {
    sendMessage({ message: prompt });
    // Additional scroll to bottom when template prompts are selected
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chatbot</Text>
          </View>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "chat" ? styles.activeMode : null,
              ]}
              onPress={() => setMode("chat")}
            >
              <Feather
                name="message-circle"
                size={20}
                color={mode === "chat" ? colors.white : colors.primaryBlue}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === "voice" ? styles.activeMode : null,
              ]}
              onPress={() => setMode("voice")}
            >
              <Feather
                name="phone"
                size={20}
                color={mode === "voice" ? colors.white : colors.primaryBlue}
              />
            </TouchableOpacity>
          </View>
        </View>{" "}
        {mode === "chat" ? (
          <>
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {/* Message */}
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.role === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <Markdown>{message.message}</Markdown>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.promptsContainer}
              contentContainerStyle={styles.promptsContentContainer}
            >
              {templatePrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptButton}
                  onPress={() => handleTemplatePrompt(prompt)}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input Field */}
            <View style={styles.inputContainer}>
              <Input
                placeholder="Masukkan pesan disini..."
                value={input.message}
                onChangeText={(message) => setInput({ ...input, message })}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  sendMessage(input);
                  setInput({ ...input, message: "" });
                }}
              >
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.voiceContainer}>
            <View style={styles.voiceContentContainer}>
              <View style={styles.voiceIconContainer}>
                <Feather name="phone" size={60} color={colors.primaryBlue} />
              </View>
              <Text style={styles.voiceTitle}>Panggilan Suara</Text>
              <Text style={styles.voiceDescription}>
                Fitur ini memungkinkan Anda berbicara langsung dengan asisten
                virtual kami. Tekan tombol untuk memulai panggilan.
              </Text>
              <TouchableOpacity style={styles.callButton}>
                <Feather name="phone-call" size={28} color="white" />
                <Text style={styles.callButtonText}>Mulai Panggilan</Text>
              </TouchableOpacity>{" "}
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  modeToggle: {
    flexDirection: "row",
    backgroundColor: colors.backgroundBlue,
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeMode: {
    backgroundColor: colors.primaryBlue,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: colors.primaryBlue,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  promptsContainer: {
    maxHeight: 60,
    marginBottom: 10,
  },
  promptsContentContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  promptButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  promptText: {
    color: colors.primaryBlue,
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  voiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceContentContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voiceIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundBlue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  voiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 12,
  },
  voiceDescription: {
    fontSize: 16,
    color: colors.grayTwo,
    textAlign: "center",
    marginBottom: 24,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
