import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "@/constants/colors";

export const Button = ({
  children,
  style,
  ...props
}: TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});
