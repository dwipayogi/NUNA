import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants/colors";
import {
  getProgressAnalysis,
  ProgressAnalysis,
} from "@/services/analyticsService";

export const ProgressSection: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressAnalysis | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressAnalysis = async () => {
      try {
        setLoading(true);
        const data = await getProgressAnalysis();
        setProgressData(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch progress analysis:", err);
        setError(err.message || "Gagal memuat data perkembangan");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressAnalysis();
  }, []);

  if (loading) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="trending-up" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Perkembangan</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Memuat data perkembangan...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="trending-up" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Perkembangan</Text>
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Feather name="trending-up" size={20} color={colors.primaryBlue} />
        <Text style={styles.insightTitle}>Perkembangan</Text>
      </View>
      {progressData && (
        <>
          <Text style={styles.insightDescription}>{progressData.message}</Text>

          {progressData.positiveMoodPercentage > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarWrapper}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${progressData.positiveMoodPercentage}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {progressData.positiveMoodPercentage}% mood positif
              </Text>
            </View>
          )}

          <View style={styles.growthContainer}>
            <Feather
              name={
                progressData.growthPercentage.startsWith("+")
                  ? "arrow-up-right"
                  : "arrow-down-right"
              }
              size={16}
              color={
                progressData.growthPercentage.startsWith("+")
                  ? "#4ADE80"
                  : "#F43F5E"
              }
            />
            <Text
              style={[
                styles.growthText,
                {
                  color: progressData.growthPercentage.startsWith("+")
                    ? "#4ADE80"
                    : "#F43F5E",
                },
              ]}
            >
              {progressData.growthPercentage} dibanding periode sebelumnya
            </Text>
          </View>
        </>
      )}
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
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#4ADE80",
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.grayTwo,
  },
  growthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
