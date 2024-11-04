import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import { cameraIcons } from '../../common/icons';
import { uploadMedia } from '../../helpers/cameraActions';
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from 'expo-av';
import { PICTURE, VIDEO } from '../../common/constants';
import { ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { ModalButtonsProps, ModalPreviewProps } from './ModalPreview.types';
import { colors } from '../../common/colors';

const ModalButtons = ({ img, onPress }: ModalButtonsProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={img} style={styles.controlIcon} />
    </TouchableOpacity>
  )
}

const ModalPreview = ({ media, setMedia, mediaType, setUploadStatus, orientation }: ModalPreviewProps) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    }
  }, []);

  const confirmMedia = async () => {
    setMedia("");
    await uploadMedia(media, mediaType === 'picture' ? PICTURE : VIDEO, setUploadStatus, orientation);
  };

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const videoDuration = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const statusSuccess = status as AVPlaybackStatusSuccess;
      if (statusSuccess.durationMillis) {
        setDuration(statusSuccess.durationMillis);
      }
    }
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        setPosition(status.positionMillis);
      }
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds, 10) < 10 ? "0" : ""}${seconds}`;
  };

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  return (
    <TouchableOpacity style={[globalStyles.container, {backgroundColor: colors.black,}]} activeOpacity={1} onPress={toggleControls}>
      {mediaType === PICTURE ? (
        <Image source={{ uri: media }} style={styles.media} resizeMode="contain" />
      ) : (
        <Video
          ref={videoRef}
          source={{ uri: media }}
          style={styles.media}
          isLooping
          resizeMode={ResizeMode.CONTAIN}
          onLoad={videoDuration}
        />
      )}

      {mediaType === 'video' && controlsVisible && (
        <>
          <View style={styles.controlsVideoContainer}>
            <ModalButtons onPress={togglePlayback} img={isPlaying ? cameraIcons.pause : cameraIcons.play} />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onValueChange={async (value) => {
                setPosition(value);
                if (videoRef.current) {
                  await videoRef.current.setPositionAsync(value);
                }
              }}
              minimumTrackTintColor={colors.white}
              maximumTrackTintColor={colors.black}
              thumbTintColor={colors.white}
            />
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </>
      )}

      <View style={styles.containerButtons}>
        <ModalButtons onPress={confirmMedia} img={cameraIcons.accept} />
        <ModalButtons onPress={() => setMedia("")} img={cameraIcons.close} />
      </View>
    </TouchableOpacity>
  );
};

export default ModalPreview;

const styles = StyleSheet.create({
  media: {
    width: "100%",
    height: "100%",
  },
  containerButtons: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingVertical: 15,
    backgroundColor: colors.transparentBlack,
    flexDirection: "row-reverse",
    paddingHorizontal: 15,
  },
  controlIcon: {
    width: 45,
    height: 45,
    marginHorizontal: 12,
  },
  controlsVideoContainer: {
    position: "absolute",
    bottom: "48%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: "15%",
    flexDirection: "row",
    justifyContent: "center",
  },
  slider: {
    width: "74%",
  },
  timeText: {
    color: colors.white,
    textShadowColor: colors.black,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },

});
