import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

export interface MoodEntry {
  id?: string;
  mood: string;
  createdAt?: string;
  endedAt?: string;
  userId?: string;
}

/**
 * Get the user's active mood
 * @returns Promise<MoodEntry | null> The active mood or null if none exists
 */
export const getActiveMood = async (): Promise<MoodEntry | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/mood-history/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No active mood
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active mood:", error);
    throw error;
  }
};

/**
 * Save a new mood entry
 * @param mood The mood to save
 * @returns Promise<MoodEntry> The created mood entry
 */
export const saveMood = async (mood: string): Promise<MoodEntry> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/mood-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mood }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const newMoodEntry = await response.json();

    // Save to local storage as well for offline access
    await AsyncStorage.setItem("currentMood", mood);

    return newMoodEntry;
  } catch (error) {
    console.error("Error saving mood:", error);
    throw error;
  }
};

/**
 * Get mood emoji based on the mood string
 * @param mood The mood string
 * @returns The corresponding emoji
 */
export const getMoodEmoji = (mood: string): string => {
  switch (mood) {
    case "Hebat":
      return "😄";
    case "Baik":
      return "🙂";
    case "Oke":
      return "😐";
    case "Buruk":
      return "😕";
    case "Sangat Buruk":
      return "😞";
    default:
      return "😐";
  }
};

/**
 * Get mood color based on the mood string
 * @param mood The mood string
 * @returns The corresponding color
 */
export const getMoodColor = (mood: string): string => {
  switch (mood) {
    case "Hebat":
      return "#4ADE80";
    case "Baik":
      return "#93C5FD";
    case "Oke":
      return "#FACC15";
    case "Buruk":
      return "#FB923C";
    case "Sangat Buruk":
      return "#F87171";
    default:
      return "#CBD5E1";
  }
};
