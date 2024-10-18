import { ImageSourcePropType } from "react-native";

export type CameraActionButtonProps = {
  onPress: () => void;
  img: ImageSourcePropType,
}

export type CameraScreenProps = {
  setUserLogued: React.Dispatch<React.SetStateAction<boolean>>
}