import { CameraView } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { Dispatch, SetStateAction } from "react";

export type takePictureProps = {
  cameraRef: React.RefObject<CameraView>;
  mediaLibraryPermission:MediaLibrary.PermissionResponse;
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>;
  setLoading: Dispatch<SetStateAction<boolean>>;
} 
