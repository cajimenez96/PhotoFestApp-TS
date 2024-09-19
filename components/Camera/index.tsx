import React, { forwardRef, useEffect } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { globalStyles } from '../../styles/globalStyles';
import { ICamera } from './Camera.type';
import * as MediaLibrary from 'expo-media-library';
import PermissionModal from '../PermissionModal';
import { View } from 'react-native';

const Camera = forwardRef<CameraView, ICamera>(({
  children,
  torch = false,
  mode,
  facing,
  flash,
  handleBarCodeScanned,
  zoom,
}, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  useEffect(() => {
    if (!permission || !mediaLibraryPermission || !microphonePermission) {
      requestPermission();
      requestMediaLibraryPermission();
      requestMicrophonePermission()
    }
  }, []);

  if (!permission || !mediaLibraryPermission || !microphonePermission) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted || !microphonePermission.granted) {
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

  return (
    <CameraView
      onBarcodeScanned={handleBarCodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417"],
      }}
      style={[globalStyles.container, globalStyles.padding]}
      autofocus="on"
      enableTorch={torch}
      mode={mode}
      facing={facing}
      flash={flash}
      ref={ref}
      zoom={zoom} 
    >
      {children}
    </CameraView>
  );
});

export default Camera;
