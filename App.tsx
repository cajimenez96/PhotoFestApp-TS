import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screen/Onboarding/Onboarding';
import { getAsyncStorage } from './helpers/helper';
import { TOKEN } from './common/constants';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [userLogued, setUserLogued] = useState<boolean>(false)
  const [onboardingStatus, setOnboardingStatus] = useState<string>("");

  useEffect(() => {

    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
        if (onboardingStatus !== null) setOnboardingStatus(onboardingStatus);

        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 2000);
        
      } catch (error) {
        console.error('Error retrieving onboarding status:', error);
      }
      finally {
        setAppIsReady(true);
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

  const renderContent = () => {
    if (onboardingStatus === 'true') {
      return userLogued ? <CameraScreen setUserLogued={setUserLogued}/> : <QRScanner setUserLogued={setUserLogued}/>;
    }

    return <Onboarding setCompletedOnboarding={setOnboardingStatus} />;
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      style={{ flex: 1}}
      onLayout={onLayoutRootView}
    >
      <StatusBar hidden />
      {renderContent()}
    </View>
  );
}

export default App;
