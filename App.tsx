import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import CameraScreen from './screen/CameraScreen';
import QRScanner from './screen/QRScanner';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={QRScanner} />
        <Stack.Screen name='Camera' component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
