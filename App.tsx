import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  const [userLogued, setUserLogued] = useState<boolean>(false)

  return (
    <>
      <StatusBar hidden />
      {!userLogued ?
        <QRScanner setUserLogued={setUserLogued }/> :
        <CameraScreen /> 
      }                    
    </>
  );
}

export default App;
