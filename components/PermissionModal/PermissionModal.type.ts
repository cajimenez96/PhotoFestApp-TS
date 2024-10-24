import * as MediaLibrary from 'expo-media-library';

export type PermissionModalProps = {
  permission: MediaLibrary.EXPermissionResponse | null;
  requestPermission: () => Promise<MediaLibrary.EXPermissionResponse>;
  mediaLibraryPermission: MediaLibrary.PermissionResponse | null;
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>;
  microphonePermission: boolean;
  requestMicrophonePermission: () => Promise<boolean>;
}

export type PermissionButtonProps = {
  title: string;
  description: string;
  granted: boolean | undefined;
  onPress: () => void;
}
