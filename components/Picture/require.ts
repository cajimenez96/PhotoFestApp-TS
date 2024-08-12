import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { takePictureProps } from './Picture.type';

export const takePicture = async ({cameraRef, mediaLibraryPermission, requestMediaLibraryPermission, setLoading}:takePictureProps) => {
  setLoading(true)
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
        await MediaLibrary.createAlbumAsync('Expo', asset, false);
      }
    } catch (error) {
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  }
};
