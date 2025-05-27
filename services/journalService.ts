import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://nuna.yogserver.web.id";

// Interface for Journal data
export interface Journal {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Get all journals
export const getAllJournals = async (): Promise<Journal[]> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/journals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch journals");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching journals:", error);
    throw error;
  }
};

// Get journal by ID
export const getJournalById = async (id: string): Promise<Journal> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/journals/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch journal");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching journal by ID:", error);
    throw error;
  }
};

// Create a new journal
export const createJournal = async (journalData: {
  title: string;
  content: string;
  mood: string;
}): Promise<Journal> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/journals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(journalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create journal");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating journal:", error);
    throw error;
  }
};

// Update a journal
export const updateJournal = async (
  id: string,
  journalData: {
    title?: string;
    content?: string;
    mood?: string;
  }
): Promise<Journal> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/journals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(journalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update journal");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating journal:", error);
    throw error;
  }
};

// Delete a journal
export const deleteJournal = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/journals/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete journal");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting journal:", error);
    throw error;
  }
};

// Helper function to get color based on mood
export const getMoodColor = (mood: string): string => {
  switch (mood.toLowerCase()) {
    case "senang":
    case "happy":
      return "#4ADE80"; // green
    case "tenang":
    case "relaxed":
    case "damai":
      return "#3B82F6"; // blue
    case "produktif":
      return "#60A5FA"; // light blue
    case "netral":
    case "neutral":
    case "okay":
    case "oke":
      return "#FACC15"; // yellow
    case "cemas":
    case "anxious":
      return "#FB923C"; // orange
    case "stres":
    case "stressed":
      return "#F97316"; // dark orange
    case "sedih":
    case "sad":
      return "#F87171"; // red
    default:
      return "#CBD5E1"; // gray
  }
};
