import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screen/Onboarding/Onboarding';

const App = () => {
  const [userLogued, setUserLogued] = useState<boolean>(false)
  const [onboardingStatus, setOnboardingStatus] = useState<string>("");

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
  }, []);

  const renderContent = () => {
    if (onboardingStatus === 'true') {
      return userLogued ? <CameraScreen /> : <QRScanner setUserLogued={setUserLogued} />;
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
