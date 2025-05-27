import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id?: string;
  username: string;
  email?: string;
  name?: string;
  createdAt?: string;
}

/**
 * Get the current user data from local storage
 * @returns Promise<User | null> The user data or null if not found
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userDataString = await AsyncStorage.getItem("user");
    if (!userDataString) {
      return null;
    }
    return JSON.parse(userDataString);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Set the current user data in local storage
 * @param userData The user data to save
 */
export const setCurrentUser = async (userData: User): Promise<void> => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error setting current user:", error);
    throw error;
  }
};

/**
 * Get a greeting message based on the current time of day
 * @returns A greeting message (e.g., "Selamat Pagi!")
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi!";
  if (hour < 18) return "Selamat Siang!";
  return "Selamat Malam!";
};
