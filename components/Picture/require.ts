import { CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const takePicture = async (cameraRef: React.RefObject<CameraView>, mediaLibraryPermission: MediaLibrary.PermissionResponse, requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>) => {
  if (cameraRef.current) {
    try {
      const options = {
        quality: 1,
        base64: true,
        exif: true,
        skipProcessing: true,
      };
      const picture = await cameraRef.current.takePictureAsync(options);
      if (picture) {
        const filename = FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: picture.uri,
          to: filename,
        });
        if (!mediaLibraryPermission.granted) {
          const { status } = await requestMediaLibraryPermission();
          if (status !== 'granted') {
            console.error('Permission to access media library is required!');
            return;
          }
        }
        const asset = await MediaLibrary.createAssetAsync(filename);
        console.log(asset)
        await MediaLibrary.createAlbumAsync('Expo', asset, false);
        console.log('Photo saved to gallery:', asset.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }
};
