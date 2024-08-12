import { ImageSourcePropType } from "react-native";

export type CameraButtonProps = {
  onPress?: () => void;
  onPressPromise?: () => Promise<void>;
  source: ImageSourcePropType;
  typeDispatch?: boolean;
  disableImage?: boolean;
}