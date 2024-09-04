import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadFile } from '../firebase/firebase.config';
import { sendToBackend } from '../screen/CameraScreen/require';
import { Dispatch, SetStateAction } from 'react';
import { CameraView } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as ImageManipulator from 'expo-image-manipulator';
import { MediaTypePicture, MediaTypeVideo } from '../common/constants';
import { Alert } from 'react-native';

const saveToLibrary = async (filename: string, mediaLibraryPermission: any, requestMediaLibraryPermission: () => Promise<any>) => {
  if (!mediaLibraryPermission.granted) {
    const { status } = await requestMediaLibraryPermission();
    if (status !== 'granted') {
      console.error('Permission to access media library is required!');
      return;
    }
  }
  const asset = await MediaLibrary.createAssetAsync(filename);
  await MediaLibrary.createAlbumAsync('FestBook', asset, false);
  return asset;
};

export const takePicture = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>,
  mediaLibraryPermission: MediaLibrary.PermissionResponse,
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>
) => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 1500);

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
        const orientation = await ScreenOrientation.getOrientationAsync();
        let rotation = 0;

        switch (orientation) {
          case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
            rotation = 90;
            break;
          case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
            rotation = -90;
            break;
          case ScreenOrientation.Orientation.PORTRAIT_UP:
            rotation = 0;
            break;
        }

        const { uri: manipulatedUri } = await ImageManipulator.manipulateAsync(
          picture.uri,
          [{ rotate: rotation }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const namePhoto = `photo_${Date.now()}.jpg`;
        const filename = FileSystem.documentDirectory + namePhoto;

        await FileSystem.copyAsync({ from: manipulatedUri, to: filename });
        const asset = await saveToLibrary(filename, mediaLibraryPermission, requestMediaLibraryPermission);

        if (asset) {
          const downloadURL = await uploadFile(manipulatedUri, namePhoto);
          if (downloadURL) {
            await sendToBackend(downloadURL, asset.width, asset.height, MediaTypePicture);
          }
        }
      }
    } catch (error) {
      Alert.alert("Error al guardar", "Ha ocurrido un error al guardar la foto")
    }
  }
};

export const takeVideo = async (
  cameraRef: React.MutableRefObject<CameraView | null>,
  isRecording: boolean,
  setIsRecording: Dispatch<SetStateAction<boolean>>,
  mediaLibraryPermission: MediaLibrary.PermissionResponse,
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (cameraRef.current) {
    try {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        if (video) {
          const videoName = `video_${Date.now()}.mp4`;
          const filename = FileSystem.documentDirectory + videoName;
          await FileSystem.copyAsync({ from: video.uri, to: filename });
          const asset = await saveToLibrary(filename, mediaLibraryPermission, requestMediaLibraryPermission);

          if (asset) {
            const downloadURL = await uploadFile(video.uri, videoName);
            if (downloadURL) {
              await sendToBackend(downloadURL, asset?.width, asset?.height, MediaTypeVideo);
            }
          }
        }
      }
    } catch (error) {
      Alert.alert("Error al guardar", "Ha ocurrido un error al guardar el video")
      setIsRecording(false);
    }
  }
};
