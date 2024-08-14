import { BarcodeScanningResult } from "expo-camera";
import { ReactNode } from "react";

export interface ICamera {
  children: ReactNode;
  torch?: boolean;
  handleBarCodeScanned?: (scanningResult: BarcodeScanningResult) => void;
}
