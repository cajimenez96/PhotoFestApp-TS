import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';
import { getAsyncStorage } from './helpers/helper';
import { useEffect, useState } from 'react';
import { TOKEN } from './common/constants';

const Stack = createStackNavigator();

const App = () => {
  const [newToken, setNewToken] = useState<string | null>();

  useEffect(() => {
    const updateToken = async () => {
      const token = await getAsyncStorage(TOKEN);
      setNewToken(token);
    }

    updateToken();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator initialRouteName={newToken ? 'Camera' : 'Login'} screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={QRScanner} />
        <Stack.Screen name='Camera' component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
