import React from 'react'
import { Text, View, StyleSheet } from "react-native";

export default function CameraVideo() {
  return (
    <View style={styles.container}>
      <Text>Welcome to camera video Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});