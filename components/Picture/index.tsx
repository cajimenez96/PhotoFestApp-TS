import { CameraView, useCameraPermissions, CameraOrientation } from 'expo-camera';
import { useRef, useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { takePicture } from './require';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF } from '../../common/constants';
import { cameraIcons } from '../../common/icons';
import { globalStyles } from '../../styles/globalStyles';
import CameraButton from '../CameraButton';

const CameraPicture = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const { facing, toggleFlash, flash, toggleCameraType, toggleCameraFacing } = useCamera();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!permission || !mediaLibraryPermission) {
      requestPermission();
      requestMediaLibraryPermission();
    }
  }, []);

  if (!permission || !mediaLibraryPermission) {
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

  return (
    <View style={globalStyles.container}>
      <CameraView style={[globalStyles.container, globalStyles.padding]} facing={facing} ref={cameraRef} flash={flash} >
        <View style={styles.flashView}>
          <CameraButton
            onPress={toggleFlash}
            source={flash === FLASHOFF ? cameraIcons.flashOffImg : cameraIcons.flashImg}
            typeDispatch={false}
          />
        </View>
        <View style={[globalStyles.container, styles.buttonContainer]}>
          <CameraButton
            onPress={toggleCameraType}
            source={cameraIcons.recordingImg}
            typeDispatch={false}
          />
          <CameraButton
            onPress={loading ? undefined : () => takePicture({ cameraRef, mediaLibraryPermission, requestMediaLibraryPermission, setLoading })}
            source={cameraIcons.dispatchPhotoImg}
            typeDispatch={true}
            disableImage={loading}
          />
          <CameraButton
            onPress={toggleCameraFacing}
            source={cameraIcons.flipCameraImg}
            typeDispatch={false}
          />
        </View>
      </CameraView>
    </View>
  );
}

export default CameraPicture;

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
