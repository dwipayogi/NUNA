import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

export function useConnectionDetails(): ConnectionDetails | undefined {
  const [details, setDetails] = useState<ConnectionDetails | undefined>(undefined);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/livekit/token`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      });
      const json = await response.json();

      if (json.serverUrl && json.participantToken) {
        setDetails({
          url: json.serverUrl,
          token: json.token,
        });
      }
    };

    fetchToken();
  }, []);

  return details;
}

type ConnectionDetails = {
  url: string;
  token: string;
};