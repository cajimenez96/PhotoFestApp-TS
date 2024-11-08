import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadFile } from '../firebase/firebase.config';
import { sendToBackend } from '../screen/CameraScreen/require';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { PICTURE, VIDEO } from '../common/constants';
import { Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker"
import NetInfo from '@react-native-community/netinfo';
import { Camera } from 'react-native-vision-camera';
import { mediaTypeId } from '../screen/CameraScreen/CameraScreen.type';

const saveToLibrary = async (filename: string) => {
  const asset = await MediaLibrary.createAssetAsync(filename);
  return asset;
};

const adjustDimensions = (width: number, height: number, isPhoto: boolean, orientation: number) => {
  if (!isPhoto && (orientation === 0 || orientation === 180)) {
    return { width: height, height: width };
  }
  return { width, height };
};

const resetUploadStatus = (setUploadStatus: React.Dispatch<React.SetStateAction<string>>) => {
  setTimeout(() => setUploadStatus(''), 1000);
};

export const uploadMedia = async (
  mediaUri: string,
  type: 'picture' | 'video',
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
  orientation: number,
  mediaIds: mediaTypeId
) => {
  const isPhoto = type === PICTURE;
  const name = isPhoto ? `photo_${Date.now()}.jpg` : `video_${Date.now()}.mp4`;
  const filename = FileSystem.documentDirectory + name;
  await FileSystem.copyAsync({ from: mediaUri, to: filename });
  const asset = await saveToLibrary(filename);

  const connection = await NetInfo.fetch();
  if (!connection.isConnected) return;

  if (!asset) return
  const { width, height } = adjustDimensions(asset.width, asset.height, isPhoto, orientation);

  const downloadURL = await uploadFile(mediaUri, name);
  if (downloadURL) {
    await sendToBackend(downloadURL, width, height, isPhoto ? mediaIds.pictureId : mediaIds.videoId, setUploadStatus)
  }
  resetUploadStatus(setUploadStatus)
};

export const takePicture = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  cameraRef: RefObject<Camera>,
  setPicture: React.Dispatch<React.SetStateAction<string>>,
  flash: "on" | "off" | "auto" | undefined,
) => {
  setLoading(true);

  if (cameraRef.current) {
    try {
      const picture = await cameraRef.current.takePhoto({
        flash: flash,
        enableShutterSound: true,
      })
      if (picture) {
        setPicture(`file://${picture.path}`)
      }
    } catch (error) {
      Alert.alert("Error al guardar", "Ha ocurrido un error al guardar la foto")
    } finally {
      setLoading(false)
    }
  }
};

export const takeVideo = async (
  cameraRef: RefObject<Camera>,
  isRecording: boolean,
  setIsRecording: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setVideo: React.Dispatch<React.SetStateAction<string>>,
  flashVideo: "on" | "off" | undefined,
  setTimer: React.Dispatch<React.SetStateAction<number>>,
  setIntervalId: React.Dispatch<React.SetStateAction<number | null>>,
  intervalId: number | null,
  setPausedRecording: React.Dispatch<React.SetStateAction<boolean>>,
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
        setPausedRecording(false);
        if (intervalId) {
          clearInterval(intervalId)
          setIntervalId(null);
          setTimer(0)
        }

      } else {
        setIsRecording(true);
        setTimer(0);

        const id = setInterval(() => {
          setTimer(prev => prev + 1);
        }, 1000);
        setIntervalId(id);

        cameraRef.current.startRecording({
          onRecordingFinished: (video) => {
            setVideo(`file://${video.path}`);
          },
          onRecordingError: (error) => {
            console.error(error);
            Alert.alert("Error al grabar", "Ha ocurrido un error al grabar el video");
            setIsRecording(false);
          },
          flash: flashVideo,
        });
      }
    } catch (error) {
      Alert.alert("Error al guardar", "Ha ocurrido un error al guardar el video")
      setIsRecording(false);
      if (intervalId) clearInterval(intervalId);
      setTimer(0)
    }
  }
};

export const pauseStartVideo = async (
  pausedRecording: boolean,
  setPausedRecording: React.Dispatch<React.SetStateAction<boolean>>,
  cameraRef: RefObject<Camera>,
  intervalId: number | null,
  setIntervalId: React.Dispatch<React.SetStateAction<number | null>>,
  setTimer: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    if (!pausedRecording) {
      await cameraRef.current?.pauseRecording();
      setPausedRecording(true);

      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    } else {
      await cameraRef.current?.resumeRecording();
      setPausedRecording(false);

      const id = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setIntervalId(id);

      setTimer(prev => prev + 1);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pickImage = async (
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
  mediaIds: mediaTypeId
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
    selectionLimit: 10,
  });

  const connection = await NetInfo.fetch();

  if (!connection.isConnected) {
    Alert.alert(
      "No hay conexión",
      "Por favor, conéctese a una red para poder subir un archivo",
      [{ text: "Aceptar" }]
    );
    return;
  }

  if (!result.canceled) {
    for (const asset of result.assets) {
      if (asset.uri && asset.fileName) {
        const downloadURL = await uploadFile(asset.uri, asset.fileName);
        if (downloadURL) {
          await sendToBackend(downloadURL, asset.width, asset.height, asset.type === VIDEO ? mediaIds.videoId : mediaIds.pictureId, setUploadStatus)
        }
      }
    }
    resetUploadStatus(setUploadStatus)
  }
}

