import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screen/Onboarding/Onboarding';
import { getAsyncStorage } from './helpers/helper';
import { TOKEN } from './common/constants';
import * as MediaLibrary from 'expo-media-library';
import { useCameraPermissions } from 'expo-image-picker';
import PermissionModal from './components/PermissionModal';
import { View } from 'react-native';
import { Audio } from 'expo-av';

const App = () => {
  const [userLogued, setUserLogued] = useState<boolean>(false)
  const [onboardingStatus, setOnboardingStatus] = useState<string>("");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [microphonePermission, requestMicrophonePermission] = Audio.usePermissions(); 

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
      const token = await getAsyncStorage(TOKEN)
      if (token) {
        setUserLogued(true)
      }
    }
    getToken()
  }, [userLogued]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!permission || !mediaLibraryPermission || !microphonePermission) {
        await requestPermission();
        await requestMediaLibraryPermission();
        await requestMicrophonePermission();
      }
    };
    requestPermissions();
  }, []);

  if (!permission || !mediaLibraryPermission || !microphonePermission) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted || !microphonePermission.granted) {
    return (
      <PermissionModal
        permission={permission}
        requestPermission={requestPermission}
        mediaLibraryPermission={mediaLibraryPermission}
        requestMediaLibraryPermission={requestMediaLibraryPermission}
        microphonePermission={microphonePermission}
        requestMicrophonePermission={requestMicrophonePermission}
      />
    );
  }

  const renderContent = () => {
    if (onboardingStatus === 'true') {
      return userLogued ? <CameraScreen setUserLogued={setUserLogued} /> : <QRScanner setUserLogued={setUserLogued} />;
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
