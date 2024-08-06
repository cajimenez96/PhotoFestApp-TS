import { CameraView, useCameraPermissions, CameraType, CameraPictureOptions, Camera, CameraCapturedPicture, useMicrophonePermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { cameraType } from '../../common/constants';

export default function CameraPicture({ facing, setFacing, setCameraType }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);


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
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera and record audio</Text>
        <Button onPress={requestPermission} title="Grant camera permission" />
        <Button onPress={requestMediaLibraryPermission} title="Grant media library permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
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
          const filename = FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
          await FileSystem.copyAsync({
            from: picture.uri,
            to: filename,
          });

          if (!mediaLibraryPermission?.granted) {
            const { status } = await requestMediaLibraryPermission();
            if (status !== 'granted') {
              console.error('Permission to access media library is required!');
              return;
            }
          }

          // Save the photo to the media library
          const asset = await MediaLibrary.createAssetAsync(filename);
          console.log(asset)
          await MediaLibrary.createAlbumAsync('Expo', asset, false);
          console.log('Photo saved to gallery:', asset.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const changeCameraType = () => {
    setCameraType(current => (current === cameraType.picture ? cameraType.video : cameraType.picture))
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={changeCameraType}>
            <Text style={styles.text}>Record</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

});
