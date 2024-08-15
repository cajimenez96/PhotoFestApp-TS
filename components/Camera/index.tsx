import React from 'react';
import { CameraView } from 'expo-camera';
import { globalStyles } from '../../styles/globalStyles';
import { ICamera } from './Camera.type';

const Camera: React.FC<ICamera> = ({
  children,
  torch = false,
  mode,
  facing,
  flash,
  ref,
  handleBarCodeScanned,
}) => {
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
  )
}

export default Camera;
