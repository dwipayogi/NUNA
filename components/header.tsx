import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundBlue,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryBlue,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    alignSelf: "center",
  },
});

