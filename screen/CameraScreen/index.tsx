import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ViewStyle } from 'react-native';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF, MediaTypePictureId, MediaTypeVideoId, PICTURE, VIDEO } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import { pickImage, takePicture, takeVideo } from '../../helpers/cameraActions';
import * as MediaLibrary from 'expo-media-library';
import { CameraActionButtonProps, CameraScreenProps, mediaTypeId } from './CameraScreen.type';
import ModalPreview from '../../components/ModalPreview/ModalPreview';
import NetInfo from '@react-native-community/netinfo';
import { logout } from './require';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { colors } from '../../common/colors';
import CameraComponent from '../../components/Camera';
import { Camera, Point, useCameraDevice } from 'react-native-vision-camera';
import { Animated, Easing } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { formatTime, getAsyncStorage } from '../../helpers/helper';

const CameraActionButton = ({ onPress, img }: CameraActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={img} style={styles.buttonsMode} />
    </TouchableOpacity>
  )
}

const CameraScreen = ({ setUserLogued }: CameraScreenProps) => {
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraModePhoto, toggleCameraModeVideo, mode, isRecording, setIsRecording, setIsConnectedToWifi, isConnectedToWifi, timer, setTimer, intervalId, setIntervalId } = useCamera();

  const [loading, setLoading] = useState<boolean>(false);
  const [mediaLibraryPermission] = MediaLibrary.usePermissions();
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);

  const [picture, setPicture] = useState<string>('');
  const [video, setVideo] = useState<string>('');

  const cameraref = useRef<Camera>(null)
  const device = useCameraDevice(facing)
  const suportFocus = device?.supportsFocus

  const [uiRotation] = useState(new Animated.Value(0));
  const [orientation, setOritation] = useState(0);

  const [focusIndicator, setFocusIndicator] = useState({ x: 0, y: 0, visible: false });
  const focusAnimation = useRef(new Animated.Value(1)).current;
  const [isFocusing, setIsFocusing] = useState(false);

  const [mediaIds, setMediaIds] = useState<mediaTypeId>({ pictureId: "", videoId: "" });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnectedToWifi(state.isConnected);
    });

    const loadMediaIds = async () => {
      const pictureId = await getAsyncStorage(MediaTypePictureId);
      const videoId = await getAsyncStorage(MediaTypeVideoId);

      if (pictureId && videoId) {
        setMediaIds({ pictureId, videoId });
      }
    };
    loadMediaIds();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnectedToWifi === false) {
      Alert.alert(
        'No hay conexión',
        'Las fotos y videos que captures no se subirán a la red, pero se guardarán en tu galería local.',
        [{ text: 'Aceptar' }]
      )
    }
  }, [isConnectedToWifi]);

  const focus = useCallback((point: Point) => {
    if (!suportFocus) return
    const c = cameraref.current;
    if (c == null || isFocusing) return;

    setIsFocusing(true);
    setFocusIndicator({ x: point.x, y: point.y, visible: true });

    Animated.sequence([
      Animated.timing(focusAnimation, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(focusAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setFocusIndicator(prev => ({ ...prev, visible: false })));

    c.focus(point).then(() => setIsFocusing(false)).catch(() => setIsFocusing(false));
  }, [isFocusing, suportFocus]);

  if (!mediaLibraryPermission) {
    return <View />;
  }

  const pictureOrVideo = () => {
    if (mode === "picture") {
      loading ? undefined : takePicture(setLoading, cameraref, setPicture, flash)
    } else {
      loading ? undefined : takeVideo(cameraref, isRecording, setIsRecording, setLoading, setVideo, flash, setTimer, setIntervalId, intervalId)
    }
  }

  const handlePickImage = async () => {
    await pickImage(
      setUploadStatus,
      mediaIds
    );
  };

  const handleLogout = async () => {
    await logout();
    setUserLogued(false);
  }

  if (picture) {
    return <ModalPreview
      media={picture}
      setMedia={setPicture}
      mediaType='picture'
      setUploadStatus={setUploadStatus}
      orientation={orientation}
      mediaIds={mediaIds}
    />
  }

  if (video) {
    return <ModalPreview
      media={video}
      setMedia={setVideo}
      mediaType='video'
      setUploadStatus={setUploadStatus}
      orientation={orientation}
      mediaIds={mediaIds}
    />
  }

  const animateRotation = (toValue: number) => {
    setOritation(toValue)
    Animated.timing(uiRotation, {
      toValue,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const uiStyle: ViewStyle = {
    transform: [
      {
        rotate: uiRotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y })
  })

  const orientationTimer = (orientation: number) => {
    switch (orientation) {
      case orientation = 0:
        return styles.timerPortrait
      case orientation = -90:
        return styles.timerLandscapeRigth
      case orientation = 90:
        return styles.timerLandscapeLeft
      case orientation = 180:
        return styles.timerPortraitUpsideDown
      default:
        break;
    }
  }

  return (
    <View style={globalStyles.container}>
      <GestureDetector gesture={gesture}>
        <CameraComponent
          ref={cameraref}
          facing={facing}
          animateRotation={animateRotation}
        />
      </GestureDetector>
      {isRecording &&
        <View style={orientationTimer(orientation)}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        </View>
      }
      <View style={styles.flashView}>
        <CameraButton
          onPress={isRecording ? () => { } : () => setLogoutModalVisible(true)}
          source={cameraIcons.exit}
          typeDispatch={false}
          disableImage={isRecording}
          uiStyle={uiStyle}
        />
        {device?.hasFlash &&
          <CameraButton
            onPress={isRecording ? () => { } : toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
            disableImage={isRecording}
            uiStyle={uiStyle}
          />
        }
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSup}>

          <CameraButton
            source={cameraIcons.galleryIcon}
            typeDispatch={false}
            disableImage={isRecording}
            onPress={isRecording ? undefined : handlePickImage}
            uiStyle={uiStyle}
          />

          <CameraButton
            onPress={pictureOrVideo}
            source={isRecording ? cameraIcons.onRecording : (mode === "picture" ? cameraIcons.dispatchPhotoImg : cameraIcons.startRecording)}
            typeDispatch={true}
            uiStyle={uiStyle}
          />

          <CameraButton
            onPress={isRecording ? () => { } : toggleCameraFacing}
            source={cameraIcons.flipCameraImg}
            typeDispatch={false}
            disableImage={isRecording}
            uiStyle={uiStyle}
          />
        </View>

        <View style={[styles.buttonBot, isRecording && styles.isRecordingOpacity]}>
          <CameraActionButton
            onPress={isRecording ? () => { } : toggleCameraModeVideo}
            img={mode === VIDEO ? cameraIcons.videoModeDark : cameraIcons.videoMode}
          />
          <CameraActionButton
            onPress={isRecording ? () => { } : toggleCameraModePhoto}
            img={mode === PICTURE ? cameraIcons.pictureModeDark : cameraIcons.pictureMode}
          />
        </View>
      </View>

      {uploadStatus && (
        <View style={styles.loaderContainer}>
          <Text style={styles.textUploading}>{uploadStatus}</Text>
          <Image style={styles.success} source={cameraIcons.successIcon} />
        </View>
      )
      }
      <View
        style={styles.modalContainer}
      >
        <ConfirmationModal
          modalVisible={logoutModalVisible}
          setModalVisible={setLogoutModalVisible}
          onConfirm={handleLogout}
          confirmationMessage='¿Desea cerrar sesión?'
        />
      </View>

      {focusIndicator.visible && (
        <Animated.View
          style={[
            styles.focusIndicator,
            {
              top: focusIndicator.y - 25,
              left: focusIndicator.x - 25,
              transform: [{ scale: focusAnimation }],
            },
          ]}
        />
      )}
    </View>

  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  timerPortrait: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
  },
  timerLandscapeRigth: {
    position: "absolute",
    transform: [{ rotate: '-90deg' }],
    top: "43%",
  },
  timerLandscapeLeft: {
    position: "absolute",
    transform: [{ rotate: '90deg' }],
    right: 0,
    top: "43%",
  },
  timerPortraitUpsideDown: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
    transform: [{ rotate: '180deg' }],
    marginTop: 30,
  },
  timer: {
    color: colors.white,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginTop: 30,
    backgroundColor: colors.red,
  },
  focusIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  flashView: {
    position: "absolute",
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 10,
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
    backgroundColor: colors.transparentBlack,
    marginTop: 10,
    padding: 3,
  },
  isRecordingOpacity: {
    opacity: 0,
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
    color: colors.white,
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
  sliderContainer: {
    position: 'absolute',
    bottom: 185,
    left: 25,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  slider: {
    width: '93%',
    height: 40,
  },
  textZoom: {
    color: colors.white,
    left: -7,
    zIndex: 2,
  },
  success: {
    width: 20,
    height: 20,
  },
  loaderContainer: {
    position: "absolute",
    top: "4%",
    left: "30%",
    width: "40%",
    height: 38,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  textUploading: {
    fontSize: 12,
    paddingRight: 6,
  },
  modalContainer: {
    position: 'absolute',
  },
});