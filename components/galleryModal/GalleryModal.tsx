import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { cameraIcons, eventIcons } from '../../common/icons'
import { FlatList } from 'react-native-gesture-handler';
import { ResizeMode, Video } from 'expo-av';
import { Media } from '../../screen/EventGallery/EventGallery.type';
import { GalleryModalType } from './GalleryModal.types';
import { parseSize } from '../../helpers/helper';
import { colors } from '../../common/colors';
import { BackHandler } from 'react-native';

const { width, height } = Dimensions.get("window");

const GalleryModal = ({ setModalVisible, modalVisible, data, selectedIndex }: GalleryModalType) => {
  const flatListRef = useRef<FlatList<Media>>(null);

  useEffect(() => {
    if (modalVisible && selectedIndex !== null) {
      flatListRef.current?.scrollToIndex({ index: selectedIndex, animated: false });
    }
  }, [modalVisible, selectedIndex]);

  const MediaItem = ({ item }: { item: Media }) => {
    const { height: rawHeight, Width: rawWidth, MediaTypeID, MediaURL } = item;

    const numericHeight = parseSize(rawHeight);
    const numericWidth = parseSize(rawWidth);
    const aspectRatio = numericWidth && numericHeight ? numericWidth / numericHeight : 1;

    const adjustedHeight = Math.min(width / aspectRatio, height);
    const mediaStyle = { width, height: adjustedHeight };

    const [isLoading, setIsLoading] = useState(true);

    return (
      <View style={styles.customContainer}>
        {isLoading && (
          <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
        )}
        {MediaTypeID.Name === "Video" ? (
          <Video
            source={{ uri: MediaURL }}
            style={mediaStyle}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={false}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <Image
            source={{ uri: MediaURL }}
            style={mediaStyle}
            resizeMode="cover"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </View>
    );
  };

  return (
    <Modal visible={modalVisible} transparent statusBarTranslucent  onRequestClose={() => setModalVisible(false)}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Image source={eventIcons.close} style={styles.closeModal} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <MediaItem item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={selectedIndex ?? 0}
        />
      </View>
    </Modal>
  );
}

export default GalleryModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  navbar: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 2
  },
  closeModal: {
    width: 35,
    height: 35
  },
  customContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: width,
    height: height,
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});
