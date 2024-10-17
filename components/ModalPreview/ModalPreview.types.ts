import { ImageSourcePropType } from "react-native";

export type ModalPreviewProps = {
  media: string,
  setMedia: (value: string) => void,
  mediaType: 'picture' | 'video'
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
}

export type ModalButtonsProps = {
  img: ImageSourcePropType;
  onPress: () => void;
}
