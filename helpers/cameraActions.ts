import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { uploadFile } from '../firebase/firebase.config';
import { sendToBackend } from '../screen/CameraScreen/require';
import { Dispatch, SetStateAction } from 'react';
import { CameraView } from 'expo-camera';
import { MediaTypePicture, MediaTypeVideo, VIDEO } from '../common/constants';
import { Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker"

const saveToLibrary = async (filename: string) => {
  const asset = await MediaLibrary.createAssetAsync(filename);
  await MediaLibrary.createAlbumAsync('FestBook', asset, false);
  return asset;
};

export const uploadMedia = async (mediaUri: string, type: "picture" | 'video') => {
  const isPhoto = type === "picture";
  const name = isPhoto ? `photo_${Date.now()}.jpg` : `video_${Date.now()}.mp4`;
  const filename = FileSystem.documentDirectory + name;

  await FileSystem.copyAsync({ from: mediaUri, to: filename });
  const asset = await saveToLibrary(filename);

  if (asset) {
    const downloadURL = await uploadFile(mediaUri, name);
    if (downloadURL) {
      await sendToBackend(downloadURL, asset.width, asset.height, isPhoto ? MediaTypePicture : MediaTypeVideo);
    }
  }
};

export const takePicture = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>,
  setPicture: React.Dispatch<React.SetStateAction<string>>,
) => {
  setLoading(true);

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
        setPicture(picture.uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
};

export const takeVideo = async (
  cameraRef: React.MutableRefObject<CameraView | null>,
  isRecording: boolean,
  setIsRecording: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setVideo: React.Dispatch<React.SetStateAction<string>>
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
          setVideo(video.uri)
        }
      }
    } catch (error) {
      Alert.alert("Error al guardar", "Ha ocurrido un error al guardar el video")
      setIsRecording(false);
    }
  }
};

export const pickImage = async (
  setSuccessUpload: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
    selectionLimit: 10,
  });

  if (!result.canceled) {
    const totalFiles = result.assets.length;

    for (const asset of result.assets) {
      if (totalFiles > 1) setUploadStatus(`Subiendo archivos`);
      else setUploadStatus(`Subiendo archivo`)

      if (asset.uri && asset.fileName) {
        const downloadURL = await uploadFile(asset.uri, asset.fileName);
        if (downloadURL) {
          await sendToBackend(downloadURL, asset.width, asset.height, asset.type === VIDEO ? MediaTypeVideo : MediaTypePicture).then(() => {
            if (totalFiles > 1) {
              setUploadStatus('Archivos subidos')
            } else {
              setUploadStatus('Archivo subido')
            }
          })
        }
      }
    }
    setSuccessUpload(true)
    setTimeout(() => {
      setUploadStatus('')
      setSuccessUpload(false)
    }, 1000);
  }
};
