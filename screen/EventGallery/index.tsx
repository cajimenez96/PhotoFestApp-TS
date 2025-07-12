import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEvent, getImages } from './require';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Media } from './EventGallery.type';
import { colors } from '../../common/colors';
import { cameraIcons, eventIcons } from '../../common/icons';
import { ResizeMode, Video } from 'expo-av';
import GalleryModal from '../../components/galleryModal/GalleryModal';

const EventGallery = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState("");
  const [data, setData] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPagelimit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState("");
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchImages = async () => {
    if (loading || pageLimit || isUnauthorized) return;
    await getImages(page, setPagelimit, setData, setPage, setLoading, setIsUnauthorized);
  };

  useEffect(() => {
    fetchImages();
    getEvent(setTitle)
  }, []);

  const openModal = (index: number) => {
    setModalVisible(true)
    setSelectedIndex(index)
  }

  const renderItem = ({ item }: { item: Media & { index: number } }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity style={styles.link} onPress={() => openModal(item.index)}>
        {item.MediaTypeID.Name === 'Video' ? (
          <>
            <Image source={cameraIcons.play} style={styles.iconVideo} />
            <Video
              source={{ uri: item.MediaURL }}
              style={styles.file}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={false}
            />
          </>
        ) : (
          <Image source={{ uri: item.MediaURL, cache: 'force-cache' }} style={styles.file} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')} style={styles.backButton}>
          <Image source={cameraIcons.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {isUnauthorized ? (
        <View style={styles.errorView}>
          <Image style={styles.caution} source={eventIcons.caution} alt='Atención' />
          <Text style={styles.errorText}>{isUnauthorized}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.gallery}
          onEndReached={fetchImages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator style={styles.loader} size={40} color={colors.white} /> : null}
          removeClippedSubviews={false}
        />
      )}

      <GalleryModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        data={data}
        selectedIndex={selectedIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black09,
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.black09,
  },
  backButton: {
    padding: 12,
    backgroundColor: colors.gold,
    borderRadius: 100,
  },
  backButtonText: {
    color: colors.white,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginStart: 15,
    color: colors.white,
  },
  gallery: {
    justifyContent: 'flex-start',
  },
  imageContainer: {
    flexBasis: '33.33%',
    margin: 1,
    alignItems: 'flex-start',
    position: 'relative',
  },
  link: {
    width: 120
  },
  file: {
    width: '100%',
    height: 118,
    backgroundColor: colors.lightBlack
  },
  iconVideo: {
    width: 30,
    height: 30,
    position: "absolute",
    zIndex: 1,
    right: "37%",
    bottom: "37%"
  },
  loader: {
    marginTop: 30,
  },
  errorView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 160,
  },
  caution: {
    width: 90,
    height: 90,
  },
  errorText: {
    color: colors.white,
    width: 270,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    paddingTop: 19
  }
});

export default EventGallery;
