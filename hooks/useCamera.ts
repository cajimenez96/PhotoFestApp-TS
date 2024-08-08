import { CameraMode, CameraType, FlashMode } from 'expo-camera';
import { useState } from 'react';
import { BACK, FLASHOFF, FLASHON, FRONT, PICTURE, VIDEO } from '../common/constants';

const useCamera = () => {
  const [facing, setFacing] = useState<CameraType>(BACK);
  const [cameraMode, setCameraMode] = useState<CameraMode>(PICTURE);
  const [flash, setFlash] = useState<FlashMode>(FLASHOFF);

  const toggleFlash = () => {
    setFlash(current => (current === FLASHOFF ? FLASHON : FLASHOFF));
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === BACK ? FRONT : BACK));
  }

  const toggleCameraType = () => {
    setCameraMode(current => (current === PICTURE ? VIDEO : PICTURE));
  }

  return {
    facing,
    setFacing,
    cameraMode,
    toggleCameraFacing,
    setCameraMode,
    toggleCameraType,
    toggleFlash,
    flash
  }
}

export default useCamera;