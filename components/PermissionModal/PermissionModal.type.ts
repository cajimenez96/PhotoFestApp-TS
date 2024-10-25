import { PermissionResponse } from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export type PermissionModalProps = {
  permission: MediaLibrary.EXPermissionResponse | null;
  requestPermission: () => Promise<MediaLibrary.EXPermissionResponse>;
  mediaLibraryPermission: MediaLibrary.PermissionResponse | null;
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>;
  microphonePermission: PermissionResponse;
  requestMicrophonePermission: () => Promise<PermissionResponse>;
}

export type PermissionButtonProps = {
  title: string;
  description: string;
  granted: boolean | undefined;
  onPress: () => void;
}
