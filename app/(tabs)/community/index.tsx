import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "@/constants/colors";
import {
  getAllPosts,
  formatTimeAgo,
  Post,
  likePost,
  unlikePost,
} from "@/services/communityService";

import { ScrollableTab } from "@/components/ScrollableTab";

// This screen shows a list of community posts where users can read and interact with discussions.
// Users can search for posts, filter by categories, and create new posts.

export default function CommunityScreen() {
  // This is the main screen for the community section.
  // Users can search for posts, filter by categories, and view a list of posts.

  const [searchQuery, setSearchQuery] = useState(""); // Keeps track of the search input.
  const [activeTab, setActiveTab] = useState("semua"); // Keeps track of the selected category.
  const [posts, setPosts] = useState<Post[]>([]); // Store the posts from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // Helps navigate between screens.

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
      Alert.alert("Error", "Failed to load community posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This function displays each post in the list.
  const renderPost = ({
    item,
  }: {
    item: Post & { likes?: number; commentsCount?: number };
  }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => {
        // When a post is clicked, navigate to its details page.
        router.push({
          pathname: "/(tabs)/community/[id]",
          params: { id: item.id },
        });
      }}
    >
      {/* Displays the author's information and post details. */}{" "}
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(item.user?.username || "A").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>
              {item.user?.username || "Anonymous"}
            </Text>
            <Text style={styles.postTime}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.content}
      </Text>
      {/* Displays tags related to the post. */}
      <View style={styles.tagsContainer}>
        {item.tags &&
          item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
      </View>{" "}
      {/* Displays actions like liking, commenting, and sharing. */}{" "}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={async () => {
            try {
              if (item.likedByMe) {
                // If already liked, unlike the post
                const result = await unlikePost(item.id);
                setPosts((prevPosts) =>
                  prevPosts.map((p) =>
                    p.id === item.id
                      ? { ...p, likes: result.likes, likedByMe: false }
                      : p
                  )
                );
              } else {
                // Otherwise, like the post
                const result = await likePost(item.id);
                setPosts((prevPosts) =>
                  prevPosts.map((p) =>
                    p.id === item.id
                      ? { ...p, likes: result.likes, likedByMe: true }
                      : p
                  )
                );
              }
            } catch (error) {
              console.error("Error toggling like:", error);
              Alert.alert("Error", "Failed to update like status");
            }
          }}
        >
          <Feather
            name="heart"
            size={18}
            color={item.likedByMe ? "#EF4444" : "#64748B"}
            solid={item.likedByMe}
          />
          <Text
            style={[styles.actionText, item.likedByMe && { color: "#EF4444" }]}
          >
            {item.likes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={18} color="#64748B" />
          <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Function to filter posts based on search and category
  const getFilteredPosts = () => {
    if (!posts) return [];

    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category/tag
    if (activeTab !== "semua") {
      filtered = filtered.filter(
        (post) =>
          post.tags && post.tags.some((tag) => tag.toLowerCase() === activeTab)
      );
    }

    return filtered;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Displays the header with the title and a filter button. */}
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Komunitas</Text>
      </View>

      {/* Search bar for finding posts. */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#64748B"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari diskusi..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Tabs for filtering posts by category. */}
      <View style={styles.tabsContainer}>
        <ScrollableTab
          tabs={[
            "Semua",
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
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* List of posts displayed in the community feed. */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
            <Text style={styles.retryButtonText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : getFilteredPosts().length > 0 ? (
        <FlatList
          data={getFilteredPosts()}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchPosts}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery || activeTab !== "semua"
              ? "Tidak ada post yang cocok dengan filter"
              : "Belum ada post di komunitas"}
          </Text>
        </View>
      )}

      {/* Button to create a new post. */}
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
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
