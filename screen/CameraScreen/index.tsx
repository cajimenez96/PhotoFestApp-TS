import { CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF, PICTURE, VIDEO } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../../components/CameraButton';
import Camera from '../../components/Camera';
import { pickImage, takePicture, takeVideo } from '../../helpers/cameraActions';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import { CameraActionButtonProps, CameraScreenProps } from './CameraScreen.type';
import ModalPreview from '../../components/ModalPreview/ModalPreview';
import NetInfo from '@react-native-community/netinfo';
import { logout } from './require';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { colors } from '../../common/colors';

const CameraActionButton = ({ onPress, img }: CameraActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={img} style={styles.buttonsMode} />
    </TouchableOpacity>
  )
}

const CameraScreen = ({ setUserLogued }: CameraScreenProps) => {
  const { facing, toggleFlash, flash, toggleCameraFacing, toggleCameraModePhoto, toggleCameraModeVideo, mode, isRecording, setIsRecording, zoom, setZoom, setIsConnectedToWifi, isConnectedToWifi } = useCamera();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaLibraryPermission] = MediaLibrary.usePermissions();
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const [picture, setPicture] = useState<string>('');
  const [video, setVideo] = useState<string>('');

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
      loading ? undefined : takePicture(setLoading, cameraRef, setPicture)
    } else {
      loading ? undefined : takeVideo(cameraRef, isRecording, setIsRecording, setLoading, setVideo)
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
          <CameraButton
            onPress={() => setLogoutModalVisible(true)}
            source={cameraIcons.exit}
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
              onPress={isRecording ? () => { } : toggleCameraModeVideo}
              img={mode === VIDEO ? cameraIcons.videoModeDark : cameraIcons.videoMode}
            />
            <CameraActionButton
              onPress={isRecording ? () => { } : toggleCameraModePhoto}
              img={mode === PICTURE ? cameraIcons.pictureModeDark : cameraIcons.pictureMode}
            />
          </View>
        </View>
        <View style={styles.sliderContainer}>
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
            minimumTrackTintColor={colors.white}
            maximumTrackTintColor={colors.white}
            thumbTintColor={colors.white}
          />
        </View>
      </Camera>
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
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  flashView: {
    flexDirection: 'row',
    justifyContent: "space-between",
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