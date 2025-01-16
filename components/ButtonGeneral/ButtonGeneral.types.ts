import { ViewStyle } from "react-native";

export interface ButtonGeneralProps {
  onPress?: () => void;
  style?: ViewStyle;
  stylePress?: ViewStyle;
  children: React.ReactNode;
}
