import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants/colors";

export const TipsSection: React.FC = () => {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Feather name="coffee" size={20} color={colors.primaryBlue} />
        <Text style={styles.insightTitle}>Tips Kesehatan Mental</Text>
      </View>

      <View style={styles.insightList}>
        <View style={styles.insightItem}>
          <Feather
            name="sun"
            size={16}
            color="#FACC15"
            style={styles.insightItemIcon}
          />
          <Text style={styles.insightItemText}>
            <Text style={styles.boldText}>Rutinitas Pagi</Text>: Mulailah hari
            dengan meditasi singkat 5 menit untuk menjernihkan pikiran.
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Feather
            name="activity"
            size={16}
            color="#10B981"
            style={styles.insightItemIcon}
          />
          <Text style={styles.insightItemText}>
            <Text style={styles.boldText}>Aktivitas Fisik</Text>: Tetapkan
            target 20 menit olahraga ringan setiap hari.
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Feather
            name="moon"
            size={16}
            color="#818CF8"
            style={styles.insightItemIcon}
          />
          <Text style={styles.insightItemText}>
            <Text style={styles.boldText}>Tidur Berkualitas</Text>: Kurangi
            penggunaan gawai 1 jam sebelum tidur untuk meningkatkan kualitas
            istirahat.
          </Text>
        </View>

        <View style={styles.insightItem}>
          <Feather
            name="book-open"
            size={16}
            color={colors.primaryBlue}
            style={styles.insightItemIcon}
          />
          <Text style={styles.insightItemText}>
            <Text style={styles.boldText}>Rekomendasi Bacaan</Text>: "Atomic
            Habits" oleh James Clear untuk membantu membangun kebiasaan baik.
          </Text>
        </View>
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
  boldText: {
    fontWeight: "600",
    color: colors.black,
  },
});
