import React, { FC, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  DeviceEventEmitter,
  PixelRatio,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { orderBy } from 'lodash';
import dimension, { scaleSize } from '~/theme/dimension';
import Icon from './Icon';
import LoadingIndicator from './LoadingIndicator';

export interface VideoPlayerProps {
  data: any;
  postId?: string;
  onPressMarkSeenPost?: () => void;
}

const PLAYER_HEIGHT = scaleSize(232);

const VideoPlayer: FC<VideoPlayerProps> = ({
  data,
  postId,
  onPressMarkSeenPost,
}: VideoPlayerProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const video = React.useRef<Video>();
  const [isPlaying, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCalledApi, setIsCalledApi] = useState(false);

  const { url, id, thumbnails } = data || {};

  const getThumbnailImageLink = () => {
    const deviceWidthPixel = PixelRatio.get() * dimension.deviceWidth;
    if (thumbnails?.length > 0) {
      const newThumbnails = orderBy(
        thumbnails, ['width'], ['asc'],
      );
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
        console.error(
          '>>>>>>>loadAsync error>>>>>>>', error,
        );
      }
    }
  };

  useEffect(
    () => {
      const videoListener = DeviceEventEmitter.addListener(
        'playVideo',
        (videoId: any) => {
          if (!!videoId && videoId !== id && isPlaying) {
            video.current?.pauseAsync?.();
          }
        },
      );

      const stopVideoListener = DeviceEventEmitter.addListener(
        'stopAllVideo',
        async () => {
          if (video.current) {
            const currentStatus = await video.current.getStatusAsync();
            // @ts-ignore
            if (!currentStatus?.isPlaying) return;
            try {
              video.current.pauseAsync();
            } catch (error) {
              console.error(
                'STOP VIDEO FAILED>>>>>>>>>>', error,
              );
            }
          }
        },
      );
      return () => {
        videoListener?.remove?.();
        stopVideoListener?.remove?.();
      };
    }, [isPlaying],
  );

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isPlaying) {
      setLoading(false);
      DeviceEventEmitter.emit(
        'playVideo', id,
      );
    }
    if ((status?.durationMillis > 5 * 1000 || status?.durationMillis <= 5 * 1000) && !!postId && !isCalledApi) {
      onPressMarkSeenPost?.();
      setIsCalledApi(true);
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
          console.warn(
            'video failed', error,
          );
        }}
      />
      {!isPlaying && (
        <Image style={styles.thumbnail} source={{ uri: posterUrl }} />
      )}

      {loading ? (
        <LoadingIndicator size={60} color={colors.gray20} />
      ) : !isPlaying ? (
        <TouchableOpacity
          activeOpacity={url ? 0.85 : 1}
          onPress={() => {
            loadAsyncVideo();
          }}
          style={styles.buttonPlay}
        >
          <Icon size={60} tintColor={colors.gray20} icon="CirclePlay" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      // width: '100%',
      height: PLAYER_HEIGHT,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.black,
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
      backgroundColor: colors.black,
    },
    buttonPlay: {
      position: 'absolute',
      zIndex: 2,
      alignSelf: 'center',
    },
  });
};

export default VideoPlayer;
