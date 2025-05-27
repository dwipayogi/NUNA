import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://nuna.yogserver.web.id"; // Replace with your API URL

// Interfaces for community data
export interface User {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
  userId: string;
  user: User;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  likes?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: {
    id: string;
    username: string;
  };
  comments?: Comment[];
  likedByMe?: boolean;
}

// Format the time difference between now and a given date
export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffMs = now.getTime() - pastDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (diffSec < 60) {
    return `${diffSec} detik`;
  } else if (diffMin < 60) {
    return `${diffMin} menit`;
  } else if (diffHour < 24) {
    return `${diffHour} jam`;
  } else if (diffDay < 7) {
    return `${diffDay} hari`;
  } else if (diffWeek < 4) {
    return `${diffWeek} minggu`;
  } else if (diffMonth < 12) {
    return `${diffMonth} bulan`;
  } else {
    return `${diffYear} tahun`;
  }
};

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get post by ID
export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch post");
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData: {
  title: string;
  content: string;
  tags: string[];
}): Promise<Post> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create post");
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (commentData: {
  content: string;
  postId: string;
}): Promise<Comment> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create comment");
    }

    const comment = await response.json();
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Get comments for a post
export const getCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/api/comments/post/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Get user data from AsyncStorage
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem("user");
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Function to like a post
export const likePost = async (postId: string) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to like post");
  }

  return await response.json();
};

// Function to unlike a post
export const unlikePost = async (postId: string) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/unlike`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unlike post");
  }

  return await response.json();
};

// Function to update a post
export const updatePost = async (
  postId: string,
  postData: { title: string; content: string; tags: string[] }
): Promise<Post> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update post");
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Function to delete a post
export const deletePost = async (
  postId: string
): Promise<{ message: string }> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
