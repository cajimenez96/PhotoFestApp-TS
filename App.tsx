import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

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

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboardingStatus === 'true' ? (
          userLogued ? (
            <Stack.Screen name="Camera">
              {() => <CameraScreen setUserLogued={setUserLogued} setOnboardingStatus={setOnboardingStatus} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="QRScanner">
              {() => <QRScanner setUserLogued={setUserLogued} />}
            </Stack.Screen>
          )
        ) : (
          <Stack.Screen name="Onboarding">
            {() => <Onboarding setCompletedOnboarding={setOnboardingStatus} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    <StatusBar hidden />
  </GestureHandlerRootView>
  );
}

export default App;
