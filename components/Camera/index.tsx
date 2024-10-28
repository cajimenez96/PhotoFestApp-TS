import React, { forwardRef, useEffect, useState } from 'react';
import { ICamera } from './Camera.type';
import { AppState, AppStateStatus } from 'react-native';
import { useCameraDevice, Camera } from 'react-native-vision-camera';

const CameraComponent = forwardRef<Camera, ICamera>(({
  torch,
  facing,
  codeScanner, 
  setUiRotation
}, ref) => {
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
      onUIRotationChanged={setUiRotation}
    />
  );
});

export default CameraComponent;
