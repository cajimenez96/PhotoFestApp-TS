import { ImageSourcePropType } from "react-native";
import { mediaTypeId } from "../../screen/CameraScreen/CameraScreen.type";

export type assetSizeType = {
  width: number;
  height: number;
}

export type ModalPreviewProps = {
  media: string,
  setMedia: (value: string) => void,
  mediaType: 'picture' | 'video'
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
  orientation: number,
  mediaIds: mediaTypeId,
  isPicker: boolean
  assetSize: assetSizeType
}

export type ModalButtonsProps = {
  img: ImageSourcePropType;
  onPress: () => void;
}
