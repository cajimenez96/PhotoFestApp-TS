import { RefObject } from 'react';
import { Camera, CodeScanner } from 'react-native-vision-camera';

export interface ICamera {
  torch?: 'on' | 'off' | undefined;
  facing: 'front' | 'back';
  ref?: RefObject<Camera>;
  codeScanner?: CodeScanner;
}
