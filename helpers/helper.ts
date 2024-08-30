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