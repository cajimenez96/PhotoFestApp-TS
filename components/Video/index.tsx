import React from 'react'
import { Text, View, StyleSheet } from 'react-native';

const CameraVideo = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to camera video Screen</Text>
    </View>
  )
}

export default CameraVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});