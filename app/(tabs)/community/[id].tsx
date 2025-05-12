import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/constants/colors";
import {
  getPostById,
  formatTimeAgo,
  Post,
  createComment,
  getCurrentUser,
} from "@/services/communityService";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Default avatar for users without profile images
  const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=";

  // Fetch post details and current user when component mounts
  useEffect(() => {
    fetchPostDetails();
    fetchCurrentUser();
  }, [id]);

  // Function to fetch post details
  const fetchPostDetails = async () => {
    if (!id) {
      setError("Post ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const postData = await getPostById(id as string);
      setPost(postData);
      setLikeCount(0); // Reset like count, in a real app this would be from the API
    } catch (err: any) {
      setError(err.message || "Failed to load post details");
      Alert.alert("Error", "Failed to load post details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get current user
  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to get user data:", err);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleComment = async () => {
    if (commentText.trim().length === 0 || !user) return;

    try {
      setSubmittingComment(true);
      await createComment({
        content: commentText,
        postId: id as string,
      });
      setCommentText("");

      // Refresh post to show the new comment
      fetchPostDetails();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
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
          <Text style={styles.headerTitle}>Diskusi</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      </SafeAreaView>
    );
  }

  if (!post || error) {
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
          <Text style={styles.headerTitle}>Detail</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Post tidak ditemukan"}
          </Text>
          {error && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchPostDetails}
            >
              <Text style={styles.retryButtonText}>Coba lagi</Text>
            </TouchableOpacity>
          )}
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
        <Text style={styles.headerTitle}>Diskusi</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={20} color={colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.postCard}>
            <View style={styles.authorContainer}>
              <Image
                source={{
                  uri: DEFAULT_AVATAR + (post.userId.charCodeAt(0) % 70),
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.authorName}>{post.user.username}</Text>
                <Text style={styles.postTime}>
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLike}
              >
                <Feather
                  name={liked ? "heart" : "heart"}
                  size={18}
                  color={liked ? "#EF4444" : "#64748B"}
                />
                <Text
                  style={[styles.actionText, liked && { color: "#EF4444" }]}
                >
                  {likeCount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={18} color="#64748B" />
                <Text style={styles.actionText}>{post.comments.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Feather name="bookmark" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Komentar ({post.comments.length})
            </Text>
            {post.comments.length === 0 ? (
              <View style={styles.emptyCommentsContainer}>
                <Text style={styles.emptyCommentsText}>
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </Text>
              </View>
            ) : (
              post.comments.map((comment) => (
                <View key={comment.id}>
                  <View style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Image
                        source={{
                          uri:
                            DEFAULT_AVATAR +
                            (comment.userId.charCodeAt(0) % 70),
                        }}
                        style={styles.commentAvatar}
                      />
                      <View style={styles.commentHeaderText}>
                        <Text style={styles.commentAuthor}>
                          {comment.user.username}
                        </Text>
                        <Text style={styles.commentTime}>
                          {formatTimeAgo(comment.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <Feather name="heart" size={14} color="#64748B" />
                        <Text style={styles.commentActionText}>0</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <Feather
                          name="message-square"
                          size={14}
                          color="#64748B"
                        />
                        <Text style={styles.commentActionText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <Image
            source={{
              uri: user
                ? DEFAULT_AVATAR + (user.id.charCodeAt(0) % 70)
                : DEFAULT_AVATAR + "1",
            }}
            style={styles.currentUserAvatar}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Tulis komentar..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              commentText.trim().length === 0 || submittingComment
                ? styles.sendButtonDisabled
                : null,
            ]}
            onPress={handleComment}
            disabled={commentText.trim().length === 0 || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Feather
                name="send"
                size={18}
                color={
                  commentText.trim().length === 0 ? "#94A3B8" : colors.white
                }
              />
            )}
          </TouchableOpacity>
        </View>
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
  shareButton: {
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
    paddingBottom: 16,
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
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
  },
  postTime: {
    fontSize: 12,
    color: colors.grayTwo,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
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
  commentsSection: {
    marginBottom: 80, // Add more space at the bottom for the comment input
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentHeaderText: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.black,
  },
  commentTime: {
    fontSize: 11,
    color: colors.grayTwo,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  commentInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 12,
  },
  currentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#E2E8F0",
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
  retryButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyCommentsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  emptyCommentsText: {
    fontSize: 14,
    color: colors.grayTwo,
    textAlign: "center",
  },
});
