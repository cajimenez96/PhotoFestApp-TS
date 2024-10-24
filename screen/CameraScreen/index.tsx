import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF, PICTURE, VIDEO } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import { pickImage, takePicture, takeVideo } from '../../helpers/cameraActions';
import * as MediaLibrary from 'expo-media-library';
import { CameraActionButtonProps, CameraScreenProps } from './CameraScreen.type';
import ModalPreview from '../../components/ModalPreview/ModalPreview';
import NetInfo from '@react-native-community/netinfo';
import { logout } from './require';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { colors } from '../../common/colors';
import CameraComponent from '../../components/Camera';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const CameraActionButton = ({ onPress, img }: CameraActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={img} style={styles.buttonsMode} />
    </TouchableOpacity>
  )
}

const CameraScreen = ({ setUserLogued }: CameraScreenProps) => {
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraModePhoto, toggleCameraModeVideo, mode, isRecording, setIsRecording, setIsConnectedToWifi, isConnectedToWifi } = useCamera();

  const [loading, setLoading] = useState<boolean>(false);
  const [mediaLibraryPermission] = MediaLibrary.usePermissions();
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);

  const [picture, setPicture] = useState<string>('');
  const [video, setVideo] = useState<string>('');

  const cameraref = useRef<Camera>(null)
  const device = useCameraDevice(facing) 

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnectedToWifi(state.isConnected);
    });

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

  if (!mediaLibraryPermission) {
    return <View />;
  }

  const pictureOrVideo = () => {
    if (mode === "picture") {
      loading ? undefined : takePicture(setLoading, cameraref, setPicture, flash)
    } else {
      loading ? undefined : takeVideo(cameraref, isRecording, setIsRecording, setLoading, setVideo, flash)
    }
  }

  const handlePickImage = async () => {
    await pickImage(
      setUploadStatus,
    );
  };

  const handleLogout = async () => {
    await logout();
    setUserLogued(false);
  }

  if (picture) {
    return <ModalPreview media={picture} setMedia={setPicture} mediaType='picture' setUploadStatus={setUploadStatus} />
  }

  if (video) {
    return <ModalPreview media={video} setMedia={setVideo} mediaType='video' setUploadStatus={setUploadStatus} />
  }

  return (
    <View style={globalStyles.container}>

      <CameraComponent
        ref={cameraref}
        facing={facing}
      />

      <View style={styles.flashView}>
        <CameraButton
          onPress={isRecording ? () => { } : () => setLogoutModalVisible(true)}
          source={cameraIcons.exit}
          typeDispatch={false}
          disableImage={isRecording}
        />
        {device?.hasFlash &&
          <CameraButton
            onPress={isRecording ? () => { } : toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
            disableImage={isRecording}
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
          />

          <CameraButton
            onPress={pictureOrVideo}
            source={isRecording ? cameraIcons.onRecording : (mode === "picture" ? cameraIcons.dispatchPhotoImg : cameraIcons.startRecording)}
            typeDispatch={true}
          />

          <CameraButton
            onPress={isRecording ? () => { } : toggleCameraFacing}
            source={cameraIcons.flipCameraImg}
            typeDispatch={false}
            disableImage={isRecording}
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
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
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