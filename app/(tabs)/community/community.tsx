import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";

// Sample forum posts
const FORUM_POSTS = [
  {
    id: "1",
    author: {
      name: "Jamie Chen",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    title: "Tips mengelola stres ujian",
    content:
      "Saya merasa cemas menjelang ujian akhir. Berikut beberapa strategi yang membantu saya...",
    likes: 24,
    comments: 8,
    timeAgo: "2 jam",
    tags: ["Stres", "Ujian", "Kesehatan Mental"],
  },
  {
    id: "2",
    author: {
      name: "Alex Morgan",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    title: "Menemukan keseimbangan antara belajar dan kehidupan sosial",
    content:
      "Sulit untuk menjaga pertemanan sambil mengikuti tugas-tugas kuliah. Ada yang punya saran?",
    likes: 18,
    comments: 12,
    timeAgo: "5 jam",
    tags: ["Keseimbangan", "Sosial", "Manajemen Waktu"],
  },
  {
    id: "3",
    author: {
      name: "Taylor Williams",
      avatar:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    title: "Teknik meditasi untuk fokus lebih baik",
    content:
      "Saya telah mempraktikkan teknik meditasi ini dan benar-benar meningkatkan konsentrasi saya selama sesi belajar...",
    likes: 32,
    comments: 7,
    timeAgo: "1 hari",
    tags: ["Meditasi", "Fokus", "Kesejahteraan"],
  },
];

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const renderPost = ({ item }: { item: (typeof FORUM_POSTS)[number] }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/community/[id]",
          params: { id: item.id },
        });
      }}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.postTime}>{item.timeAgo}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="heart" size={18} color="#64748B" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={18} color="#64748B" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#64748B"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search discussions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
      </View>
      <View style={styles.tabsContainer}>
        <ScrollableTab
          tabs={["All", "Mental Health", "Academic", "Wellness", "Social"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>
      <FlatList
        data={FORUM_POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />{" "}
      <TouchableOpacity
        style={styles.newPostButton}
        onPress={() => {
          router.push("/(tabs)/community/create");
        }}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    padding: 6,
    color: colors.primaryBlue,
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
  postsList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  postCard: {
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
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    color: colors.black,
  },
  postTime: {
    fontSize: 12,
    color: colors.grayTwo,
  },
  postTitle: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "400",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.backgroundBlue,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.grayTwo,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 4,
  },
  newPostButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
