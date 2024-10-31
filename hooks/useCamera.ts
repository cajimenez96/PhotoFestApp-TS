import { useState } from 'react';
import { BACK, FLASHOFF, FLASHON, FRONT, PICTURE, VIDEO } from '../common/constants';

const useCamera = () => {
  const [facing, setFacing] = useState<'front' | 'back'>(BACK);
  const [flash, setFlash] = useState<"on" | "off" | undefined>(FLASHOFF);
  const [mode, setMode] = useState<"picture" | "video">(PICTURE);
  const [zoom, setZoom] = useState(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isConnectedToWifi, setIsConnectedToWifi] = useState<boolean | null>(true);
  const [previousFlashState, setPreviousFlashState] = useState<"on" | "off" | undefined>(FLASHOFF); 
  const [timer, setTimer] = useState(0); 
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const toggleFlash = () => {
    setFlash(current => (current === FLASHOFF ? FLASHON : FLASHOFF));
  }

  const toggleCameraFacing = () => {
    setFacing(current => {
      const newFacing = current === BACK ? FRONT : BACK;
      if (newFacing === FRONT) {
        setPreviousFlashState(flash); 
        setFlash(FLASHOFF); 
      } else {
        setFlash(previousFlashState);
      }
      setZoom(0)
      return newFacing;
    });
  };

  const toggleCameraModePhoto = () => {
    setMode(PICTURE)
    setZoom(0)
  }

  const toggleCameraModeVideo = () => {
    setMode(VIDEO)
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
    isConnectedToWifi,
    timer,
    setTimer,
    intervalId,
    setIntervalId
  }
}

export default useCamera;