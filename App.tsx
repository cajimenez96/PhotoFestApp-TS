import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { useEffect, useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screen/Onboarding/Onboarding';
import { getAsyncStorage } from './helpers/helper';
import { TOKEN } from './common/constants';
import NetInfo from '@react-native-community/netinfo';
import useCamera from './hooks/useCamera';

const App = () => {
  const [userLogued, setUserLogued] = useState<string>('');
  const [onboardingStatus, setOnboardingStatus] = useState<string>('');
  const { setIsConnectedToWifi, isConnectedToWifi } = useCamera()

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
        if (onboardingStatus !== null) setOnboardingStatus(onboardingStatus);
      } catch (error) {
        console.error('Error retrieving onboarding status:', error);
      }
    };
    checkOnboardingStatus();

    const getToken = async () => {
      const token = await getAsyncStorage(TOKEN);
      if (token) {
        setUserLogued(token);
      }
    };
    getToken();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnectedToWifi(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnectedToWifi === false) {
      Alert.alert(
        'No hay conexión',
        'Las fotos y videos que captures no se subirán a la red, pero se guardarán en tu galería local.',
        [{ text: 'Aceptar' }]
      )
    }
  }, [isConnectedToWifi]);

  const renderContent = () => {
    if (onboardingStatus === 'true') {
      return userLogued ? <CameraScreen /> : <QRScanner />;
    }

    return <Onboarding setCompletedOnboarding={setOnboardingStatus} />;
  };

  return (
    <>
      <StatusBar hidden />
      {renderContent()}
    </>
  );
}

export default App;
