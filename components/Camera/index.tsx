import React, { forwardRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { globalStyles } from '../../styles/globalStyles';
import { ICamera } from './Camera.type';
import { Button, Text, View } from 'react-native';

const Camera = forwardRef<CameraView, ICamera>(({
  children,
  torch = false,
  mode,
  facing,
  flash,
  handleBarCodeScanned,
}, ref) => {

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission ) {
      requestPermission();
    }
  }, []);

  if (!permission?.granted) {
    return (
      <View style={globalStyles.container}>
        <Text style={{ textAlign: 'center' }}>Para continuar, FestBook necesita permiso para acceder a su camara y grabar audio</Text>
        <Button onPress={requestPermission} title="Grant camera permission" />
      </View>
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
    >
      {children}
    </CameraView>
  );
});

export default Camera;
