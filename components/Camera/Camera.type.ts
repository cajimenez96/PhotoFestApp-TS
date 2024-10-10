import { BarcodeScanningResult, CameraMode, CameraType, CameraView, FlashMode } from "expo-camera";
import { ReactNode } from "react";

export interface ICamera {
  children: ReactNode;
  torch?: boolean;
  mode?: CameraMode;
  facing?: CameraType;
  flash?: FlashMode;
  ref?: React.LegacyRef<CameraView>;
  handleBarCodeScanned?: (scanningResult: BarcodeScanningResult) => void;
  zoom?: number;
}
