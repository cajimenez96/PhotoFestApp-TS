import { CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF, PICTURE, VIDEO } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import Camera from '../../components/Camera';
import { pickImage, takePicture, takeVideo } from '../../helpers/cameraActions';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import { CameraActionButtonProps } from './CameraScreen.type';

const CameraActionButton = ({ onPress, img }: CameraActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={img} style={styles.buttonsMode} />
    </TouchableOpacity>
  )
}

const CameraScreen = () => {
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraModePhoto, toggleCameraModeVideo, mode, isRecording, setIsRecording, zoom, setZoom } = useCamera();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [successUpload, setSuccessUpload] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  if (!mediaLibraryPermission) {
    return <View />;
  }

  const pictureOrVideo = () => {
    if (mode === "picture") {
      loading ? undefined : takePicture(setLoading, cameraRef, mediaLibraryPermission, requestMediaLibraryPermission)
    } else {
      loading ? undefined : takeVideo(cameraRef, isRecording, setIsRecording, mediaLibraryPermission, requestMediaLibraryPermission, setLoading)
    }
  }

  const handlePickImage = async () => {
    await pickImage(
      setSuccessUpload, 
      setUploadStatus, 
    );
  };

  return (
    <View style={globalStyles.container}>
      <Camera
        mode={mode}
        facing={facing}
        ref={cameraRef}
        flash={flash}
        torch={mode === "video" && flash === "on"}
        zoom={zoom}
      >
        <View style={styles.flashView}>
          <CameraButton
            onPress={toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonSup}>
            <CameraButton
              source={cameraIcons.galleryIcon}
              typeDispatch={false}
              disableImage={isRecording}
              onPress={handlePickImage}
            />
            <CameraButton
              onPress={pictureOrVideo}
              source={isRecording ? cameraIcons.onRecording : (mode === "picture" ? cameraIcons.dispatchPhotoImg : cameraIcons.startRecording)}
              typeDispatch={true}
              disableImage={loading}
            />
            <CameraButton
              onPress={isRecording ? undefined : toggleCameraFacing}
              source={cameraIcons.flipCameraImg}
              typeDispatch={false}
              disableImage={isRecording}
            />
          </View>
          <View style={styles.buttonBot}>
            <CameraActionButton
              onPress={toggleCameraModeVideo}
              img={mode === VIDEO ? cameraIcons.videoModeDark : cameraIcons.videoMode}
            />
            <CameraActionButton
              onPress={toggleCameraModePhoto}
              img={mode === PICTURE ? cameraIcons.pictureModeDark : cameraIcons.pictureMode}
            />
          </View>
        </View>
      </Camera>
      {uploadStatus && (
        <View style={styles.loaderContainer}>
          <Text style={styles.textUploading}>{uploadStatus}</Text>
          {!successUpload ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Image style={styles.success} source={cameraIcons.successIcon} />
          )
          }
        </View>
      )
      }
      {cameraRef &&
        <>
          {zoom !== 0 &&
            <Text style={styles.textZoom}>x{(zoom * 4).toFixed(1)}</Text>
          }
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={zoom}
            onValueChange={setZoom}
            step={0.1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ffffff"
            thumbTintColor='#ffffff'
          />
        </>
      }
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  flashView: {
    alignItems: "flex-end",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonSup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonBot: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.221)",
    marginTop: 10,
    padding: 3,
  },
  buttonsMode: {
    width: 67,
    height: 67,
    marginHorizontal: 10,
  },
  flashButton: {
    width: 60,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    marginHorizontal: 20,
  },
  disabledImage: {
    opacity: 0.5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imgDispatch: {
    height: 80,
    width: 80,
  },
  imgLateral: {
    height: 47,
    width: 47,
  },
  imgFlash: {
    height: 45,
    width: 45,
  },
  slider: {
    width: '80%',
    height: 40,
    position: 'absolute',
    bottom: 180,
    left: 40,
  },
  textZoom: {
    color: "#ffffff",
    position: "absolute",
    bottom: 220,
    left: 170,
  },
  success: {
    width: 20,
    height: 20,
  },
  loaderContainer: {
    position: "absolute",
    top: 35,
    left: 111,
    width: 135,
    height: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  textUploading: {
    fontSize: 12,
    paddingRight: 6,
  },
});