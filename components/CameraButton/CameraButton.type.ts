import { ImageSourcePropType, ViewStyle } from "react-native";

export type CameraButtonProps = {
  onPress?: () => void;
  source: ImageSourcePropType;
  typeDispatch?: boolean;
  disableImage?: boolean;
  uiStyle: ViewStyle;
}