# PhotoFestApp-TS

## Requisitos
- Node.js v18.x o superior (recomendado v18 LTS)
- npm v9.x o superior
- Expo CLI y EAS CLI instalados globalmente:
  ```sh
  npm install -g expo-cli eas-cli
  ```
- Xcode (solo para desarrollo iOS, solo en Mac)
- Android Studio (para emulador Android)
- Cuenta de Expo y GitHub

## Clonar el repositorio
```sh
git clone https://github.com/cajimenez96/PhotoFestApp-TS.git
cd PhotoFestApp-TS
```

## Instalación de dependencias
```sh
npm install
```

## Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (ajusta los valores según tu entorno):
```
EXPO_VITE_API_KEY=...
VITE_AUTH_DOMAIN=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDER_ID=...
VITE_APP_ID=...
VITE_MEASUREMENT_ID=...
VITE_API_URL=...
```

## Iniciar el proyecto

### Android (local)
1. Abre un emulador en Android Studio.
2. Ejecuta:
   ```sh
   npm run android
   ```

### iOS (local, solo en Mac)
1. Abre un simulador en Xcode.
2. Ejecuta:
   ```sh
   npm run ios
   ```

### Expo Go (solo para pruebas JS, sin dependencias nativas personalizadas)
```sh
npm start
```
Escanea el QR con la app Expo Go.

## Builds en la nube (EAS Build)

### Android
```sh
npm run build:android
```

### iOS
```sh
npm run build:ios
```

Sigue el enlace que te da Expo para descargar el .apk o .ipa generado.

## Notas importantes
- Para builds de iOS necesitas una cuenta de desarrollador de Apple.
- Para builds locales de iOS necesitas Mac y Xcode.
- Si agregas nuevas dependencias nativas o cambias configuración en `app.json`/`eas.json`, deberás crear un nuevo build de desarrollo con EAS.
- El archivo `.env` nunca debe subirse al repositorio.
- Si tienes problemas con pods en iOS, ejecuta:
  ```sh
  cd ios
  pod install
  cd ..
  ```

## Estructura recomendada de .gitignore
Incluye:
```
node_modules/
.env
ios/Pods/
ios/Podfile.lock
android/.gradle/
android/app/build/
```

---

¿Dudas? Contacta a @cajimenez96
