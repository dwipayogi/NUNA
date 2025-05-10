import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors } from "@/constants/colors";

export const Input = ({ style, ...props }: TextInputProps) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.primaryBlue}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    color: colors.primaryBlue,
    fontStyle: "italic",
  },
});
