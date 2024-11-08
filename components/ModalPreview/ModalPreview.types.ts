import { ImageSourcePropType } from "react-native";
import { mediaTypeId } from "../../screen/CameraScreen/CameraScreen.type";

export type ModalPreviewProps = {
  media: string,
  setMedia: (value: string) => void,
  mediaType: 'picture' | 'video'
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
  orientation: number,
  mediaIds: mediaTypeId, 
}

export type ModalButtonsProps = {
  img: ImageSourcePropType;
  onPress: () => void;
}
