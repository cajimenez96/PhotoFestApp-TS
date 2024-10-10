import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export interface IButton {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onClick?: (event: GestureResponderEvent) => void;
}
