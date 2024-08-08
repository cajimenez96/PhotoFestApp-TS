import CameraVideo from '../../components/Video';
import CameraPicture from '../../components/Picture';
import { PICTURE } from '../../common/constants';
import useCamera from '../../hooks/useCamera';

const CameraScreen = () => {
  const { cameraMode } = useCamera();

  return (
    <>
      {cameraMode === PICTURE ? <CameraPicture /> : <CameraVideo />}
    </>
  );
}

export default CameraScreen;
