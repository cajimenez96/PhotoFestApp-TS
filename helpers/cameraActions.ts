import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadFile } from '../firebase/firebase.config';
import { sendToBackend } from '../screen/CameraScreen/require';
import { Dispatch, SetStateAction } from 'react';
import { CameraView } from 'expo-camera';

const saveToLibrary = async (filename: string, mediaLibraryPermission: any, requestMediaLibraryPermission: () => Promise<any>) => {
  if (!mediaLibraryPermission.granted) {
    const { status } = await requestMediaLibraryPermission();
    if (status !== 'granted') {
      console.error('Permission to access media library is required!');
      return;
    }
  }
  const asset = await MediaLibrary.createAssetAsync(filename);
  await MediaLibrary.createAlbumAsync('Expo', asset, false);
};

export const takePicture = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>,
  mediaLibraryPermission: MediaLibrary.PermissionResponse,
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>
) => {
  setLoading(true)
  setTimeout(() => {
    setLoading(false);
  }, 2000);

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
        const namePhoto = `photo_${Date.now()}.jpg`
        const filename = FileSystem.documentDirectory + namePhoto;

        await FileSystem.copyAsync({ from: picture.uri, to: filename });
        await saveToLibrary(filename, mediaLibraryPermission, requestMediaLibraryPermission);

        const downloadURL = await uploadFile(picture.uri, namePhoto);
        if (downloadURL) {
          await sendToBackend(downloadURL, picture.width, picture.height);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const takeVideo = async (
  cameraRef: React.MutableRefObject<CameraView | null>,
  isRecording: boolean,
  setIsRecording: Dispatch<SetStateAction<boolean>>,
  mediaLibraryPermission: MediaLibrary.PermissionResponse,
  requestMediaLibraryPermission: () => Promise<MediaLibrary.PermissionResponse>
) => {
  if (cameraRef.current) {
    try {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        if (video) {
          const videoName = `video_${Date.now()}.mp4`
          const filename = FileSystem.documentDirectory + videoName;
          await FileSystem.copyAsync({ from: video.uri, to: filename });
          await saveToLibrary(filename, mediaLibraryPermission, requestMediaLibraryPermission);

          const downloadURL = await uploadFile(video.uri, videoName);
          if (downloadURL) {
            await sendToBackend(downloadURL);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setIsRecording(false);
    }
  }
};
