import { CameraView } from 'expo-camera';
import { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import Camera from '../../components/Camera';
import { takePicture, takeVideo } from '../../helpers/cameraActions';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = () => {
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraMode, mode, isRecording, setIsRecording } = useCamera();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<number | null>();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { PORTRAIT_UP, LANDSCAPE_LEFT, LANDSCAPE_RIGHT } = ScreenOrientation.Orientation

  useEffect(() => {
    const subscribeOrientationChange = async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      handleOrientationChange(orientation);

      const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
        handleOrientationChange(orientationInfo.orientation);
      });
      return () => {
        ScreenOrientation.removeOrientationChangeListener(subscription);
      };
    };

    subscribeOrientationChange();
  }
    , []);

  const handleOrientationChange = (orientation: ScreenOrientation.Orientation) => {
    if (orientation === PORTRAIT_UP) {
      setIsPortrait(PORTRAIT_UP);
    } else if (orientation === LANDSCAPE_LEFT) {
      setIsPortrait(LANDSCAPE_LEFT);
    } else if (orientation === LANDSCAPE_RIGHT) {
      setIsPortrait(LANDSCAPE_RIGHT);
    } else {
      setIsPortrait(null);
    }
  };

  if (!mediaLibraryPermission) {
    return <View />;
  }

  if (mode === "video") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  } else {
    ScreenOrientation.unlockAsync();
  }

  const pictureOrVideo = () => {
    if (mode === "picture") {
      loading ? undefined : takePicture(setLoading, cameraRef, mediaLibraryPermission, requestMediaLibraryPermission)
    } else {
      loading ? undefined : takeVideo(cameraRef, isRecording, setIsRecording, mediaLibraryPermission, requestMediaLibraryPermission, setLoading)
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
        <View
          style={
            isPortrait === PORTRAIT_UP
              ? styles.flashViewPortait
              : isPortrait === LANDSCAPE_LEFT
                ? styles.flashViewlandscapeLeft
                : isPortrait === LANDSCAPE_RIGHT
                  ? styles.flashViewlandscapeRigth
                  : null
          }
        >
          <CameraButton
            onPress={toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
          />
        </View>
        <View
          style={
            isPortrait === PORTRAIT_UP
              ? styles.buttonContainerPortrait
              : isPortrait === LANDSCAPE_LEFT
                ? styles.buttonContainerLandscape
                : isPortrait === LANDSCAPE_RIGHT
                  ? styles.buttonContainerLandscapeRigth
                  : null
          }
        >
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
    flex: 1,
  },
  flashViewPortait: {
    alignItems: "flex-end",
  },
  flashViewlandscapeLeft: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  flashViewlandscapeRigth: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  buttonContainerPortrait: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainerLandscape: {
    position: 'absolute',
    right: "84%",
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonContainerLandscapeRigth: {
    position: 'absolute',
    left: "84%",
    top: 0,
    bottom: 0,
    flexDirection: "column-reverse",
    justifyContent: 'center',
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
});


