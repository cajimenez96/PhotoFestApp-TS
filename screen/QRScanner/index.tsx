import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Vibration, Alert } from "react-native";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { globalStyles } from "../../styles/globalStyles";
import { cameraIcons } from "../../common/icons";
import { QRScannerData } from "./QRScanner.data";
import { useNavigation } from "@react-navigation/native";

const QRScanner: React.FC = () => {
  const navigation = useNavigation();
  const [scanned, setScanned] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  const handleFlash = () => {
    Vibration.vibrate(500);
    setFlash(!flash);
  }

  const handleBarCodeScanned = ( {data}: BarcodeScanningResult ) => {
    setScanned(true);

    try {
      const parsedData = JSON.parse(data);

      if (parsedData) {
        //Función a realizar con la información del QR
        navigation.navigate('Camera');
      } else {
        alertError(QRScannerData.loginError)
      }

    } catch (error) {
      alertError(QRScannerData.qrError)
      console.log(error);      
    }
    finally {
      setScanned(false);
    }
  };

  const alertError = (message: string) => {
    Alert(message);
  }

  return (
    <View style={globalStyles.container}>
      {scanned ? (
        <View style={[globalStyles.container, ]}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={[globalStyles.container, globalStyles.padding]}
          autofocus="on"
          enableTorch={flash}
        >
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={handleFlash}>
              <Image source={!flash ? cameraIcons.flashImg : cameraIcons.flashOffImg} style={globalStyles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.camera}>
            <View>
              <Image source={cameraIcons.scannerImg} style={styles.image} />
            </View>

            <View style={styles.boxTranslucid}>
              <Text style={styles.text}>{QRScannerData.text}</Text>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

export default QRScanner;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  boxTranslucid: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flash: {
    borderRadius: 100,
    padding: 5,
  },
});
