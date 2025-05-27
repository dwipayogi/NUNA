import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

// Interface for Mood Distribution Data
export interface MoodDistributionData {
  totalEntries: number;
  distribution: {
    [key: string]: number;
  };
}

// Interface for Pattern Analysis
export interface PatternAnalysis {
  patterns: string;
}

// Interface for Progress Analysis
export interface ProgressAnalysis {
  period: string;
  growthPercentage: string;
  message: string;
  positiveMoodPercentage: number;
}

/**
 * Get mood distribution data
 * @param startDate Optional start date in ISO format
 * @param endDate Optional end date in ISO format
 * @returns Promise<MoodDistributionData> Mood distribution data
 */
export const getMoodDistribution = async (
  startDate?: string,
  endDate?: string
): Promise<MoodDistributionData> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Build URL with query parameters if provided
    let url = `${API_URL}/api/mood-history/distribution`;
    const params = new URLSearchParams();

    if (startDate) {
      params.append("startDate", startDate);
    }

    if (endDate) {
      params.append("endDate", endDate);
    }

    // Append query parameters if any exist
    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch mood distribution");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mood distribution:", error);
    throw error;
  }
};

/**
 * Get pattern analysis data
 * @returns Promise<PatternAnalysis> Pattern analysis data
 */
export const getPatternAnalysis = async (): Promise<PatternAnalysis> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/chat/patterns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("No journal entries found for analysis");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch pattern analysis");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pattern analysis:", error);
    throw error;
  }
};

/**
 * Get progress analysis data
 * @param days Number of days to analyze (default: 30)
 * @returns Promise<ProgressAnalysis> Progress analysis data
 */
export const getProgressAnalysis = async (
  days: number = 30
): Promise<ProgressAnalysis> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/chat/progress?days=${days}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("No data available for analysis");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch progress analysis");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress analysis:", error);
    throw error;
  }
};

/**
 * Get mood statistics for a period
 * @param days Number of days to analyze (default: 7)
 * @returns Promise<any> Mood statistics data
 */
export const getMoodStatistics = async (days: number = 7): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/api/mood-history/stats?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mood statistics:", error);
    throw error;
  }
};
