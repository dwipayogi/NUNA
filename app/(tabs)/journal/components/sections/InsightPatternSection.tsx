import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants/colors";
import {
  getPatternAnalysis,
  PatternAnalysis,
} from "@/services/analyticsService";

export const InsightPatternSection: React.FC = () => {
  const [patternData, setPatternData] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatternAnalysis = async () => {
      try {
        setLoading(true);
        const data = await getPatternAnalysis();
        setPatternData(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch pattern analysis:", err);
        setError(err.message || "Gagal memuat data wawasan AI");
      } finally {
        setLoading(false);
      }
    };

    fetchPatternAnalysis();
  }, []);

  // Parse patterns from string to array
  const parsePatterns = (patternsString: string) => {
    if (!patternsString) return [];

    // Split by newline and filter empty items
    return (
      patternsString
        .split("\n")
        .map((pattern) => pattern.trim())
        .filter((pattern) => pattern.length > 0)
        // Remove leading dash if present
        .map((pattern) =>
          pattern.startsWith("-") ? pattern.substring(1).trim() : pattern
        )
    );
  };

  const patterns = patternData ? parsePatterns(patternData.patterns) : [];

  if (loading) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="zap" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Wawasan AI</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.loadingText}>Memuat wawasan AI...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="zap" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Wawasan AI</Text>
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (patterns.length === 0) {
    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Feather name="zap" size={20} color={colors.primaryBlue} />
          <Text style={styles.insightTitle}>Wawasan AI</Text>
        </View>
        <Text style={styles.insightDescription}>
          Belum cukup data untuk menghasilkan wawasan. Terus catat jurnal Anda
          untuk mendapatkan analisis yang lebih baik.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Feather name="zap" size={20} color={colors.primaryBlue} />
        <Text style={styles.insightTitle}>Wawasan AI</Text>
      </View>
      <Text style={styles.insightDescription}>
        Berdasarkan analisis dari catatan Anda, AI kami menemukan beberapa pola:
      </Text>

      <View style={styles.insightList}>
        {patterns.map((pattern, index) => (
          <View key={index} style={styles.insightItem}>
            <Feather
              name="check-circle"
              size={16}
              color={colors.primaryBlue}
              style={styles.insightItemIcon}
            />
            <Text style={styles.insightItemText}>{pattern}</Text>
          </View>
        ))}
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
  insightList: {
    marginTop: 4,
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  insightItemIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  insightItemText: {
    flex: 1,
    fontSize: 14,
    color: colors.grayTwo,
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
});
