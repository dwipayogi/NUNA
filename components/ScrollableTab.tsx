import React from "react";
import { FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

interface ScrollableTabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ScrollableTab: React.FC<ScrollableTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <FlatList
      data={tabs}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const isActive = activeTab === item.toLowerCase();
        return (
          <TouchableOpacity
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(item.toLowerCase())}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.tabsContent}
    />
  );
};

const styles = StyleSheet.create({
  tabsContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primaryBlue,
  },
  tabText: {
    fontSize: 14,
    color: colors.primaryBlue,
  },
  activeTabText: {
    color: colors.white,
  },
});
