import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { Header } from "@/components/header";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { Feather } from "@expo/vector-icons";

import { Input } from "@/components/input";
import { colors } from "@/constants/colors";

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState({ role: "user", message: "" });

  // const loadMessages = async () => {
  //   const messages = await AsyncStorage.getItem("messages");
  //   if (messages) setMessages(JSON.parse(messages));
  // };

  // const saveMessages = async (message: any) => {
  //   await AsyncStorage.setItem("messages", JSON.stringify(messages));
  // };

  // Panggil `loadMessages` saat komponen pertama kali dimuat:
  // useEffect(() => {
  //   loadMessages();
  // }, []);

  // Simpan pesan setiap kali state `messages` berubah:
  // useEffect(() => {
  //   saveMessages(messages);
  // }, [messages]);

  async function sendMessage({ message }: { message: string }) {
    if (!message) return;
    setMessages((prevMessages) => [...prevMessages, { role: "user", message }]);
    const response = await fetch("https://nutridetect-api.vercel.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat: message }),
    });
    const data = await response.json();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", message: data.content },
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
  };

  return (
    <View style={styles.container}>
      <Header title="ChatBot" subtitle="Teman Curhat Virtual" />

      <ScrollView
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Message */}
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === "user" ? styles.userMessage : styles.botMessage,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
    padding: 20,
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
    backgroundColor: colors.grayThree,
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
});
