import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://nuna.yogserver.web.id";

// Interface for meditation data
export interface Meditation {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: number;
  imageUrl: string;
  steps: string[];
  createdAt: string;
  updatedAt: string;
  color?: string; // Additional property for UI
}

/**
 * Get all meditation sessions
 * @returns Promise<Meditation[]> Array of meditation sessions
 */
export async function getAllMeditations(): Promise<Meditation[]> {
  try {
    const response = await fetch(`${API_URL}/api/meditate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch meditation sessions"
      );
    }

    const meditations = await response.json();

    // Add color property for UI (in a real app, this would come from the API)
    const colorsArray = [
      "#3B82F6",
      "#FACC15",
      "#7C3AED",
      "#10B981",
      "#EC4899",
      "#F97316",
    ];
    return meditations.map((med: Meditation, index: number) => ({
      ...med,
      color: colorsArray[index % colorsArray.length],
    }));
  } catch (error) {
    console.error("Error fetching meditations:", error);
    throw error;
  }
}

/**
 * Get a meditation session by ID
 * @param id Meditation ID
 * @returns Promise<Meditation> Meditation session
 */
export async function getMeditationById(id: string): Promise<Meditation> {
  try {
    const response = await fetch(`${API_URL}/api/meditate/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch meditation");
    }

    const meditation = await response.json();

    // Add color property for UI (in a real app, this would come from the API)
    const colorsArray = [
      "#3B82F6",
      "#FACC15",
      "#7C3AED",
      "#10B981",
      "#EC4899",
      "#F97316",
    ];
    const colorIndex = parseInt(id.split("-")[0] || "0") % colorsArray.length;
    return {
      ...meditation,
      color: colorsArray[colorIndex],
    };
  } catch (error) {
    console.error("Error fetching meditation by ID:", error);
    throw error;
  }
}

/**
 * Format seconds to MM:SS format
 * @param seconds Number of seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Categorize meditations (example function)
export function categorizeMeditations(meditations: Meditation[]): {
  meditasi: Meditation[];
  pernafasan: Meditation[];
} {
  // In a real app, this categorization would come from the API
  // For now, we'll separate based on title keywords
  const meditasi: Meditation[] = [];
  const pernafasan: Meditation[] = [];

  meditations.forEach((med) => {
    if (
      med.title.toLowerCase().includes("pernapasan") ||
      med.title.toLowerCase().includes("nafas") ||
      med.description.toLowerCase().includes("pernafasan")
    ) {
      pernafasan.push(med);
    } else {
      meditasi.push(med);
    }
  });

  return { meditasi, pernafasan };
}
