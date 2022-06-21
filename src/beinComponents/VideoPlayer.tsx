import React, {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DeviceEventEmitter,
  PixelRatio,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Video, ResizeMode} from 'expo-av';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import {orderBy} from 'lodash';
import Icon from './Icon';
import LoadingIndicator from './LoadingIndicator';

export interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  data: any;
  postId?: string;
}

const PLAYER_HEIGHT = scaleSize(232);

const VideoPlayer: FC<VideoPlayerProps> = ({
  style,
  data,
  postId,
}: VideoPlayerProps) => {
  const theme = useTheme() as ITheme;
  const {dimension, colors} = theme;
  const styles = createStyle(theme);

  const video = React.useRef();
  const [isPlaying, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const {url, id, thumbnails} = data || {};

  const getThumbnailImageLink = () => {
    const deviceWidthPixel = PixelRatio.get() * dimension.deviceWidth;
    if (thumbnails?.length > 0) {
      const newThumbnails = orderBy(thumbnails, ['width'], ['asc']);
      for (let index = 0; index < thumbnails.length; index++) {
        if (newThumbnails[index]?.width >= deviceWidthPixel) {
          return newThumbnails[index]?.url;
        }
      }
      return newThumbnails[thumbnails.length - 1]?.url;
    }
    return '';
  };

  const loadAsyncVideo = async () => {
    if (video.current && !!url) {
      setLoading(true);
      try {
        await video.current?.loadAsync?.({
          uri: url,
          overrideFileExtensionAndroid: 'm3u8',
        });
        video.current?.playAsync();
        setPlaying(true);
      } catch (error) {
        setLoading(false);
        console.log('>>>>>>>loadAsync error>>>>>>>', error);
      }
    }
  };

  useEffect(() => {
    const videoListener = DeviceEventEmitter.addListener(
      'playVideo',
      (videoId: any) => {
        if (!!videoId && videoId !== id && isPlaying) {
          video.current?.pauseAsync?.();
        }
      },
    );
    return () => {
      videoListener?.remove();
    };
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isPlaying) {
      setLoading(false);
      DeviceEventEmitter.emit('playVideo', id);
    }
  };

  if (!url && thumbnails?.length < 1) {
    return null;
  }

  const posterUrl = getThumbnailImageLink();

  return (
    <View style={[styles.container]}>
      <Video
        ref={video}
        key={`video_item_${postId}`}
        style={styles.player}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error: string) => {
          console.warn('video failed', error);
        }}
      />
      {!isPlaying && (
        <Image style={styles.thumbnail} source={{uri: posterUrl}} />
      )}

      {loading ? (
        <LoadingIndicator size={60} color={colors.bgDisable} />
      ) : !isPlaying ? (
        <TouchableOpacity
          activeOpacity={!!url ? 0.85 : 0}
          onPress={() => {
            loadAsyncVideo();
          }}
          style={styles.buttonPlay}>
          <Icon size={60} tintColor={colors.bgDisable} icon="PlayCircle" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      // width: '100%',
      height: PLAYER_HEIGHT,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.onSurface,
    },
    player: {
      position: 'absolute',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
    thumbnail: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      resizeMode: 'contain',
      backgroundColor: colors.onSurface,
    },
    buttonPlay: {
      position: 'absolute',
      zIndex: 2,
      alignSelf: 'center',
    },
  });
};

export default VideoPlayer;
