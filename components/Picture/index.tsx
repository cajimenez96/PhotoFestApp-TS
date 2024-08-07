import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { takePicture } from './require';
import useCamera from '../../hooks/useCamera';
import { FLASHOFF } from '../../common/constants';
import { cameraIcons } from '../../common/icons';

const CameraPicture = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  const { facing, toggleFlash, flash, toggleCameraType, toggleCameraFacing } = useCamera();

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
      <View style={styles.container}>
        <View>
          <Text>Para continuar, FestBook necesita permiso para acceder a su camara y grabar audio</Text>
          <Button onPress={requestPermission} title='Grant camera permission' />
          <Button onPress={requestMediaLibraryPermission} title='Grant media library permission' />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} flash={flash}>
        <View style={styles.flashView}>
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            {flash === FLASHOFF ? <Image style={styles.imgFlash} source={cameraIcons.flashOffImg}></Image> : <Image style={styles.imgFlash} source={cameraIcons.flashImg}></Image>}
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Image style={styles.imgLateral} source={cameraIcons.recordingImg}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => takePicture(cameraRef, mediaLibraryPermission, requestMediaLibraryPermission)}>
            <Image style={styles.imgDispatch} source={cameraIcons.dispatchPhotoImg}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Image style={styles.imgLateral} source={cameraIcons.flipCameraImg}></Image>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

export default CameraPicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  flashView: {
    alignItems: 'flex-end',
    margin: 23,
    marginTop: 25,
  },
  flashButton: {
    width: 60,
    padding: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 34,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    marginHorizontal: 20,
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
