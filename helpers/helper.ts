import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAsyncStorage = async (key: string) => {
  try {
    const token = await AsyncStorage.getItem(key);
    return token;
  } catch (error) {
    console.error('Error al obtener el' + key + ':' + error);
    return null;
  }
};

export const setAsyncStorage = async (key: string, token: string) => {
  try {
    await AsyncStorage.setItem(key, token);
    console.log(key + ' guardado con éxito');
  } catch (error) {
    console.error('Error al guardar el ' + key + ': ', error);
  }
}

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const handleOnboarding = async (setOnboardingStatus: (status: string) => void, state: string) => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', state);
    setOnboardingStatus(state);
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

export const parseSize = (size: string) => {
  const numericValue = parseInt(size?.replace("px", ""), 10);
  return isNaN(numericValue) ? 0 : numericValue;
};

export type RootStackParamList = {
  Camera: undefined;
  EventGallery: undefined;
};


