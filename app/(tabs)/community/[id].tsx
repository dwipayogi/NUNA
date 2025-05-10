import React, { useState, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/constants/colors";

// Sample forum posts with comments
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
      "Saya merasa cemas menjelang ujian akhir. Berikut beberapa strategi yang membantu saya mengatasi stres menghadapi ujian:\n\n1. Buat jadwal belajar yang realistis dan seimbang\n2. Latihan pernapasan dalam saat merasa cemas\n3. Istirahat cukup dan jaga pola makan\n4. Diskusikan materi dengan teman untuk pemahaman lebih baik\n5. Gunakan teknik visualisasi positif\n\nSaya harap ini bisa membantu teman-teman yang juga sedang menghadapi ujian. Apakah ada yang punya strategi lain untuk mengatasi stres ujian?",
    likes: 24,
    comments: 8,
    timeAgo: "2 jam",
    tags: ["Stres", "Ujian", "Kesehatan Mental"],
    commentsList: [
      {
        id: "c1",
        author: {
          name: "Alex Morgan",
          avatar:
            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Terima kasih untuk tipsnya! Saya akan mencoba teknik pernapasan dalam.",
        timeAgo: "1 jam",
        likes: 3,
        replies: [
          {
            id: "r1c1",
            author: {
              name: "Jamie Chen",
              avatar:
                "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
            },
            content:
              "Senang bisa membantu! Teknik pernapasan dalam memang sangat efektif untuk menenangkan pikiran.",
            timeAgo: "45 menit",
            likes: 2,
          },
        ],
      },
      {
        id: "c2",
        author: {
          name: "Taylor Williams",
          avatar:
            "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Saya juga suka mendengarkan musik instrumen saat belajar, membantu fokus dan mengurangi stres.",
        timeAgo: "45 menit",
        likes: 5,
        replies: [],
      },
      {
        id: "c3",
        author: {
          name: "Jordan Lee",
          avatar:
            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Olahraga ringan juga sangat membantu mengurangi tingkat stres. Coba lakukan jogging 15-20 menit di pagi hari!",
        timeAgo: "30 menit",
        likes: 7,
        replies: [
          {
            id: "r1c3",
            author: {
              name: "Alex Morgan",
              avatar:
                "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
            },
            content:
              "Setuju! Olahraga pagi membantu menjernihkan pikiran untuk belajar seharian.",
            timeAgo: "25 menit",
            likes: 1,
          },
          {
            id: "r2c3",
            author: {
              name: "Jamie Chen",
              avatar:
                "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
            },
            content:
              "Saya akan mencoba metode ini! Apakah ada rekomendasi latihan sederhana untuk dilakukan di dalam ruangan?",
            timeAgo: "15 menit",
            likes: 0,
          },
        ],
      },
    ],
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
    commentsList: [
      {
        id: "c1",
        author: {
          name: "Jamie Chen",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Saya membuat jadwal khusus untuk aktivitas sosial, biasanya di akhir minggu sehingga tidak mengganggu jadwal belajar saya.",
        timeAgo: "4 jam",
        likes: 8,
      },
      {
        id: "c2",
        author: {
          name: "Robin Smith",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Ajak teman-teman untuk belajar bersama, jadi kamu bisa bersosialisasi sambil tetap produktif!",
        timeAgo: "3 jam",
        likes: 6,
      },
    ],
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
    commentsList: [
      {
        id: "c1",
        author: {
          name: "Jordan Lee",
          avatar:
            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Bisakah kamu berbagi teknik meditasi spesifik yang kamu gunakan?",
        timeAgo: "20 jam",
        likes: 4,
      },
      {
        id: "c2",
        author: {
          name: "Alex Morgan",
          avatar:
            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content:
          "Saya juga merasakan manfaat meditasi. Saya merekomendasikan aplikasi Headspace untuk pemula.",
        timeAgo: "18 jam",
        likes: 9,
      },
      {
        id: "c3",
        author: {
          name: "Jamie Chen",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        content: "Berapa lama biasanya kamu bermeditasi setiap hari?",
        timeAgo: "12 jam",
        likes: 2,
      },
    ],
  },
];

// Define types for our data
type Reply = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
};

type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
  replies?: Reply[];
};

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Find the post with matching ID
  const post = FORUM_POSTS.find((item) => item.id === id);

  React.useEffect(() => {
    if (post) {
      setLikeCount(post.likes);
    }
  }, [post]);

  if (!post) {
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
          <Text style={styles.errorText}>Post tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleComment = () => {
    if (commentText.trim().length === 0) return;

    // In a real app, you would send this comment to a server
    // For demo purposes, we'll just clear the input
    setCommentText("");

    // You could also add the new comment to the local state
    // and show it immediately to the user
  };

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
        <Text style={styles.headerTitle}>Discussion</Text>
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
                source={{ uri: post.author.avatar }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.postTime}>{post.timeAgo}</Text>
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
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Feather name="bookmark" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Komentar ({post.commentsList.length})
            </Text>{" "}
            {post.commentsList.map((comment: Comment) => (
              <View key={comment.id}>
                <View style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{ uri: comment.author.avatar }}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentHeaderText}>
                      <Text style={styles.commentAuthor}>
                        {comment.author.name}
                      </Text>
                      <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                    </View>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <Feather name="heart" size={14} color="#64748B" />
                      <Text style={styles.commentActionText}>
                        {comment.likes}
                      </Text>
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
                </View>{" "}
                {comment.replies && comment.replies.length > 0 && (
                  <View style={styles.repliesContainer}>
                    <View
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 0,
                        bottom: 16,
                        width: 1,
                        backgroundColor: "#E2E8F0",
                      }}
                    />
                    {comment.replies.map((reply: Reply, index: number) => (
                      <View key={reply.id} style={styles.replyCard}>
                        <View
                          style={{
                            position: "absolute",
                            left: -16,
                            top: 16,
                            width: 16,
                            height: 1,
                            backgroundColor: "#E2E8F0",
                          }}
                        />
                        <View style={styles.commentHeader}>
                          <Image
                            source={{ uri: reply.author.avatar }}
                            style={styles.commentAvatar}
                          />
                          <View style={styles.commentHeaderText}>
                            <Text style={styles.commentAuthor}>
                              {reply.author.name}
                            </Text>
                            <Text style={styles.commentTime}>
                              {reply.timeAgo}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.commentContent}>
                          {reply.content}
                        </Text>
                        <View style={styles.commentActions}>
                          <TouchableOpacity style={styles.commentAction}>
                            <Feather name="heart" size={14} color="#64748B" />
                            <Text style={styles.commentActionText}>
                              {reply.likes}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
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
              commentText.trim().length === 0
                ? styles.sendButtonDisabled
                : null,
            ]}
            onPress={handleComment}
            disabled={commentText.trim().length === 0}
          >
            <Feather
              name="send"
              size={18}
              color={commentText.trim().length === 0 ? "#94A3B8" : colors.white}
            />
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
    marginBottom: 25, // Add space at the bottom for the comment input
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
  repliesContainer: {
    paddingLeft: 24,
    marginTop: -8,
    position: "relative",
  },
  replyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#E2E8F0",
    position: "relative",
  },
  replyConnectingLine: {
    position: "absolute",
    left: 12,
    top: -4,
    width: 16,
    height: 24,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    borderBottomLeftRadius: 8,
  },
});
