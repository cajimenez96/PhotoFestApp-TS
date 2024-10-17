import { CameraMode, CameraType, FlashMode } from 'expo-camera';
import { useState } from 'react';
import { BACK, FLASHOFF, FLASHON, FRONT, PICTURE, VIDEO } from '../common/constants';

const useCamera = () => {
  const [facing, setFacing] = useState<CameraType>(BACK);
  const [flash, setFlash] = useState<FlashMode>(FLASHOFF);
  const [mode, setMode] = useState<CameraMode>(PICTURE);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [zoom, setZoom] = useState(0);
  const [isConnectedToWifi, setIsConnectedToWifi] = useState<boolean | null>(true);

  const toggleFlash = () => {
    setFlash(current => (current === FLASHOFF ? FLASHON : FLASHOFF));
  }

  const toggleCameraFacing = () => {
    setFacing(current => {
      const newFacing = current === BACK ? FRONT : BACK;
      if (flash === FLASHON) {
        setFlash(FLASHOFF);
        setTimeout(() => {
          setFlash(FLASHON);
        }, 100);
      }
      setZoom(0)
      return newFacing;
    });
  };
  
  const toggleCameraModePhoto = () => {
    setMode(PICTURE)
    if (flash === FLASHON) {
      setFlash(FLASHOFF);
      setTimeout(() => {
        setFlash(FLASHON);
      }, 100);
    }
    setZoom(0)
  }

  const toggleCameraModeVideo = () => {
    setMode(VIDEO)
      if (flash === FLASHON) {
        setFlash(FLASHOFF);
        setTimeout(() => {
          setFlash(FLASHON);
        }, 100);
      }
      setZoom(0)
  }

  return {
    facing,
    setFacing,
    toggleCameraFacing,
    toggleFlash,
    flash,
    mode,
    setMode,
    isRecording,
    setIsRecording,
    toggleCameraModeVideo,
    toggleCameraModePhoto,
    setZoom,
    zoom,
    setIsConnectedToWifi,
    isConnectedToWifi
  }
}

export default useCamera;