import React, { useState } from 'react';
// import CameraPicture from '../components/CameraPicture';
import { cameraType } from '../../common/constants';
import CameraVideo from '../../components/Video';
import CameraPicture from '../../components/Picture';

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [CameraType, setCameraType] = useState(cameraType.picture)

  return (
    <>
      {CameraType === cameraType.picture ? <CameraPicture facing={facing} setFacing={setFacing} setCameraType={setCameraType} /> : <CameraVideo />}
    </>
  );
}
