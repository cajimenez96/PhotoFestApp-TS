import React, { forwardRef, useEffect, useState } from 'react';
import { ICamera } from './Camera.type';
import * as MediaLibrary from 'expo-media-library';
import PermissionModal from '../PermissionModal';
import { AppState, AppStateStatus, View } from 'react-native';
import { useCameraDevice, Camera, useMicrophonePermission } from 'react-native-vision-camera';
import { useCameraPermissions } from 'expo-image-picker';

const CameraComponent = forwardRef<Camera, ICamera>(({
  torch,
  facing,
  codeScanner
}, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const { hasPermission: microphonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();
  const [isActive, setIsActive] = useState(true);
  const device = useCameraDevice(facing)

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!permission || !mediaLibraryPermission || !microphonePermission) {
      requestPermission();
      requestMediaLibraryPermission();
      requestMicrophonePermission()
    }
  }, []);

  if (!permission || !mediaLibraryPermission || microphonePermission === null) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted || !microphonePermission) {
    return (
      <PermissionModal
        permission={permission}
        requestPermission={requestPermission}
        mediaLibraryPermission={mediaLibraryPermission}
        requestMediaLibraryPermission={requestMediaLibraryPermission}
        microphonePermission={microphonePermission}
        requestMicrophonePermission={requestMicrophonePermission}

      />
    );
  }

  if (!device) return

  return (
    <Camera
      style={{ flex: 1 }}
      device={device}
      isActive={isActive}
      ref={ref}
      video={true}
      audio={true}
      photo={true}
      enableZoomGesture
      torch={torch}
      codeScanner={codeScanner}
    />
  );
});

export default CameraComponent;
