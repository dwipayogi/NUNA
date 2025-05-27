import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import {
  getPostById,
  formatTimeAgo,
  Post,
  createComment,
  getCurrentUser,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
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
  // New state variables for edit and delete functionality
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [isPostCreator, setIsPostCreator] = useState(false);

  // Fetch post details and current user when component mounts
  useEffect(() => {
    fetchPostDetails();
    fetchCurrentUser();
  }, [id]); // Function to fetch post details
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
      setLikeCount(postData.likes || 0); // Set like count from API
      setLiked(postData.likedByMe || false); // Set liked state from API
    } catch (err: any) {
      setError(err.message || "Failed to load post details");
    } finally {
      setLoading(false);
    }
  };
  // Function to get current user
  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Check if current user is the post creator
      if (userData && post && userData.id === post.userId) {
        setIsPostCreator(true);
      } else {
        setIsPostCreator(false);
      }
    } catch (err) {
      console.error("Failed to get user data:", err);
    }
  };
  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike the post
        const result = await unlikePost(id as string);
        setLikeCount(result.likes);
        setLiked(false);
      } else {
        // Like the post
        const result = await likePost(id as string);
        setLikeCount(result.likes);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };  const handleComment = async () => {
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
      console.error("Error posting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // New functions for edit and delete functionality
  const openEditModal = () => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditTags(post.tags || []);
    }
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(id as string);
      router.back();
    } catch (err) {
      console.error("Error deleting post:", err);
      setIsDeleting(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!id) return;

    try {
      await updatePost(id as string, {
        title: editTitle,
        content: editContent,
        tags: editTags,
      });
      setIsEditModalVisible(false);
      fetchPostDetails();
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
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
          {" "}
          <View style={styles.postCard}>            <View style={styles.authorContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {(post.user?.username || "A").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.authorName}>
                  {post.user?.username || "Anonymous"}
                </Text>
                <Text style={styles.postTime}>
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
              
              {isPostCreator && (
                <View style={styles.postControls}>
                  <TouchableOpacity 
                    style={styles.postControlButton}
                    onPress={openEditModal}
                  >
                    <Feather name="edit-2" size={16} color={colors.primaryBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.postControlButton}
                    onPress={() => setIsDeleting(true)}
                  >
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>{" "}
            <View style={styles.tagsContainer}>
              {post.tags?.map((tag, index) => (
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
              </TouchableOpacity>{" "}
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={18} color="#64748B" />
                <Text style={styles.actionText}>
                  {post.comments?.length || 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="bookmark" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>{" "}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Komentar ({post.comments?.length || 0})
            </Text>
            {!post.comments || post.comments.length === 0 ? (
              <View style={styles.emptyCommentsContainer}>
                <Text style={styles.emptyCommentsText}>
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </Text>
              </View>
            ) : (
              post.comments.map((comment) => (
                <View key={comment.id}>
                  <View style={styles.commentCard}>
                    {" "}
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatarContainer}>
                        <Text style={styles.commentAvatarText}>
                          {(comment.user?.username || "A")
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.commentHeaderText}>
                        <Text style={styles.commentAuthor}>
                          {comment.user?.username || "Anonymous"}
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
        </ScrollView>{" "}
        <View style={styles.commentInputContainer}>
          <View style={styles.currentUserAvatarContainer}>
            <Text style={styles.currentUserAvatarText}>
              {user ? user.username?.charAt(0).toUpperCase() || "U" : "U"}
            </Text>
          </View>
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

      {/* Edit Post Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Judul"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Konten"
              value={editContent}
              onChangeText={setEditContent}
              multiline
            />
            <View style={styles.modalTagsContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Tambah tag"
                value={editTagInput}
                onChangeText={setEditTagInput}
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={() => {
                  if (editTagInput.trim().length > 0) {
                    setEditTags([...editTags, editTagInput.trim()]);
                    setEditTagInput("");
                  }
                }}
              >
                <Feather name="plus" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.selectedTagsContainer}>
              {editTags.map((tag, index) => (
                <View key={index} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{tag}</Text>
                  <TouchableOpacity
                    style={styles.removeTagButton}
                    onPress={() =>
                      setEditTags(editTags.filter((t) => t !== tag))
                    }
                  >
                    <Feather name="x" size={14} color={colors.grayTwo} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeEditModal}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primaryBlue },
                ]}
                onPress={handleUpdatePost}
              >
                <Text style={styles.modalButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleting}
        animationType="slide"
        transparent
        onRequestClose={() => setIsDeleting(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Konfirmasi Hapus</Text>
            <Text style={styles.modalMessage}>
              Apakah Anda yakin ingin menghapus pos ini?
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsDeleting(false)}
              >
                <Text style={styles.modalButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primaryBlue },
                ]}
                onPress={handleDeletePost}
              >
                <Text style={styles.modalButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  commentAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
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
  currentUserAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  currentUserAvatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    backgroundColor: colors.primaryBlue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  modalTagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginRight: 8,
  },
  addTagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  selectedTag: {
    backgroundColor: colors.backgroundBlue,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedTagText: {
    fontSize: 12,
    color: colors.grayTwo,
    marginRight: 4,
  },  removeTagButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  postControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  postControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
