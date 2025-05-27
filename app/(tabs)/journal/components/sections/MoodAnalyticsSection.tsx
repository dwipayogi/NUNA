import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants/colors";
import {
  getMoodDistribution,
  MoodDistributionData,
} from "@/services/analyticsService";

export const MoodAnalyticsSection: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodDistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodDistribution = async () => {
      try {
        setLoading(true);
        const data = await getMoodDistribution();
        setMoodData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch mood distribution:", err);
        setError("Gagal memuat data analisis mood");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodDistribution();
  }, []);

  // Get top two moods for the description text
  const getTopMoods = () => {
    if (!moodData?.distribution) return [];

    const sortedMoods = Object.entries(moodData.distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([mood]) => mood);

    return sortedMoods;
  };

  const topMoods = getTopMoods();

  if (loading) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="bar-chart-2" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Analisis Mood</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Memuat analisis mood...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="bar-chart-2" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Analisis Mood</Text>
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Feather name="bar-chart-2" size={20} color={colors.primaryBlue} />
        <Text style={styles.insightTitle}>Analisis Mood</Text>
      </View>
      <Text style={styles.insightDescription}>
        Berdasarkan catatan Anda, mood yang paling sering Anda alami adalah{" "}
        {topMoods.length >= 2 ? (
          <>
            <Text style={styles.highlightText}>{topMoods[0]}</Text> dan{" "}
            <Text style={styles.highlightText}>{topMoods[1]}</Text>.
          </>
        ) : topMoods.length === 1 ? (
          <Text style={styles.highlightText}>{topMoods[0]}</Text>
        ) : (
          "belum tersedia."
        )}
      </Text>

      <View style={styles.moodDistribution}>
        {moodData &&
          Object.entries(moodData.distribution).map(
            ([mood, percentage], index) => {
              // Define colors for different moods
              const moodColors: { [key: string]: string } = {
                Hebat: "#4ADE80",
                Baik: "#60A5FA",
                Oke: "#34D399",
                Buruk: "#FB7185",
                "Sangat Buruk": "#F43F5E",
              };

              return (
                <View key={index} style={styles.moodBarContainer}>
                  <Text style={styles.moodBarLabel}>{mood}</Text>
                  <View style={styles.moodBarWrapper}>
                    <View
                      style={[
                        styles.moodBar,
                        {
                          width: `${percentage}%`,
                          backgroundColor: moodColors[mood] || "#60A5FA",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodBarPercentage}>{percentage}%</Text>
                </View>
              );
            }
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insightCard: {
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
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 16,
    lineHeight: 20,
  },
  highlightText: {
    color: colors.primaryBlue,
    fontWeight: "600",
  },
  moodDistribution: {
    marginTop: 16,
  },
  moodBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  moodBarLabel: {
    width: 100,
    fontSize: 14,
    color: colors.grayTwo,
  },
  moodBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  moodBar: {
    height: "100%",
    borderRadius: 4,
  },
  moodBarPercentage: {
    width: 40,
    fontSize: 14,
    color: colors.grayTwo,
    textAlign: "right",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.grayTwo,
  },
  errorText: {
    color: "#F43F5E",
    textAlign: "center",
    padding: 10,
  },
});
