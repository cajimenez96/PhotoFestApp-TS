import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

export const setToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    console.log('Token guardado con éxito');
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
}