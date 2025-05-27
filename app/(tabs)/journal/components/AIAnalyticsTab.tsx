import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import {
  MoodAnalyticsSection,
  InsightPatternSection,
  ProgressSection,
  TipsSection,
} from "./sections";

export const AIAnalyticsTab: React.FC = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.insightsContainer}
      showsVerticalScrollIndicator={false}
    >
      <MoodAnalyticsSection />
      <InsightPatternSection />
      <ProgressSection />
      <TipsSection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  insightsContainer: {
    padding: 16,
    paddingBottom: 80,
  },
});
