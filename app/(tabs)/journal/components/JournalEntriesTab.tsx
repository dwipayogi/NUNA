import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Journal } from "@/services/journalService";
import { colors } from "@/constants/colors";

interface JournalEntriesTabProps {
  journals: Journal[];
  loading: boolean;
  fetchJournals: () => Promise<void>;
  renderJournalEntry: ({ item }: { item: Journal }) => React.ReactElement;
}

export const JournalEntriesTab: React.FC<JournalEntriesTabProps> = ({
  journals,
  loading,
  fetchJournals,
  renderJournalEntry,
}) => {
  if (journals.length > 0) {
    return (
      <FlatList
        data={journals}
        renderItem={renderJournalEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.entriesList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchJournals}
      />
    );
  } else {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Belum ada catatan. Tambahkan catatan baru!
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  entriesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grayTwo,
    textAlign: "center",
  },
});
