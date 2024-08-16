import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useRef, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import Camera from '../../components/Camera';
import { takePicture, takeVideo } from '../../helpers/cameraActions';

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraMode, mode, isRecording, setIsRecording } = useCamera();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!permission || !mediaLibraryPermission || !microphonePermission) {
      requestPermission();
      requestMediaLibraryPermission();
      requestMicrophonePermission();
    }
  }, []);

  if (!permission || !mediaLibraryPermission || !microphonePermission) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted) {
    return (
      <View style={[globalStyles.container, styles.container]}>
        <View>
          <Text>Para continuar, FestBook necesita permiso para acceder a su camara y grabar audio</Text>
          <Button onPress={requestPermission} title='Grant camera permission' />
          <Button onPress={requestMediaLibraryPermission} title='Grant media library permission' />
        </View>
      </View>
    );
  }

  const pictureOrVideo = () => {
    if (mode === "picture") {
      loading ? undefined : takePicture(setLoading, cameraRef, mediaLibraryPermission, requestMediaLibraryPermission)
    } else {
      takeVideo(cameraRef, isRecording, setIsRecording, mediaLibraryPermission, requestMediaLibraryPermission)
    }
  }

  return (
    <View style={globalStyles.container}>
      <Camera
        mode={mode}
        facing={facing}
        ref={cameraRef}
        flash={flash}
        torch={mode === "video" && flash === "on"}
      >
        <View style={styles.flashView}>
          <CameraButton
            onPress={toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
          />
        </View>
        <View style={[globalStyles.container, styles.buttonContainer]}>
          <CameraButton
            onPress={isRecording ? undefined : toggleCameraMode}
            source={mode === "picture" ? cameraIcons.recordingImg : cameraIcons.pictureMode}
            typeDispatch={false}
            disableImage={isRecording}
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
      </Camera>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  flashView: {
    alignItems: 'flex-end',
  },
  flashButton: {
    width: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
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
});
