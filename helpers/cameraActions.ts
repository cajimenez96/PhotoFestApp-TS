import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadFile } from '../firebase/firebase.config';
import { sendToBackend } from '../screen/CameraScreen/require';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { MediaTypePicture, MediaTypeVideo, PICTURE, SUCESSUPLOAD, VIDEO } from '../common/constants';
import { Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker"
import NetInfo from '@react-native-community/netinfo';
import { Camera } from 'react-native-vision-camera';

const saveToLibrary = async (filename: string) => {
  const asset = await MediaLibrary.createAssetAsync(filename);
  await MediaLibrary.createAlbumAsync('FestBook', asset, false);
  return asset;
};

export const uploadMedia = async (
  mediaUri: string,
  type: 'picture' | 'video',
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  const isPhoto = type === PICTURE;
  const name = isPhoto ? `photo_${Date.now()}.jpg` : `video_${Date.now()}.mp4`;
  const filename = FileSystem.documentDirectory + name;

  await FileSystem.copyAsync({ from: mediaUri, to: filename });
  const asset = await saveToLibrary(filename);

  const connection = await NetInfo.fetch();

  if (!connection.isConnected) return;

  if (asset) {
    const downloadURL = await uploadFile(mediaUri, name);
    if (downloadURL) {
      await sendToBackend(downloadURL, asset.width, asset.height, isPhoto ? MediaTypePicture : MediaTypeVideo)
        .then(() => {
          setUploadStatus(SUCESSUPLOAD)
        })
    }
    setTimeout(() => {
      setUploadStatus('')
    }, 1000);
  }
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
    }
  }
};

export const pickImage = async (
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>
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
          await sendToBackend(downloadURL, asset.width, asset.height, asset.type === VIDEO ? MediaTypeVideo : MediaTypePicture).then(() => {
            setUploadStatus(SUCESSUPLOAD)
          })
        }
      }
    }
    setTimeout(() => {
      setUploadStatus('')
    }, 1000);
  }
}

