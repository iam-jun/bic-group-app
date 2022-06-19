import React, {FC, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DeviceEventEmitter,
  PixelRatio,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Video, ResizeMode} from 'expo-av';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import {orderBy} from 'lodash';

export interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  data: any;
}

const PLAYER_HEIGHT = scaleSize(232);

const VideoPlayer: FC<VideoPlayerProps> = ({style, data}: VideoPlayerProps) => {
  const theme = useTheme() as ITheme;
  const {dimension} = theme;
  const styles = createStyle(theme);

  const video = React.useRef(null);
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

  useEffect(() => {
    if (video.current) {
      try {
        video.current?.loadAsync?.({
          uri: url,
          overrideFileExtensionAndroid: 'm3u8',
        });
      } catch (error) {
        console.log('>>>>>>>loadAsync error>>>>>>>', error);
      }
    }
  }, []);

  useEffect(() => {
    const videoListener = DeviceEventEmitter.addListener(
      'playVideo',
      (videoId: any) => {
        if (!!videoId && videoId !== id) {
          video.current?.setStatusAsync?.({shouldPlay: false});
        }
      },
    );
    return () => {
      videoListener?.remove();
    };
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isPlaying) {
      DeviceEventEmitter.emit('playVideo', id);
    }
  };

  if (!url) {
    return null;
  }

  const posterUrl = getThumbnailImageLink();

  return (
    <View style={[styles.container]}>
      <Video
        ref={video}
        // source={{
        //   uri: url,
        //   overrideFileExtensionAndroid: 'm3u8',
        // }}
        posterSource={{uri: posterUrl}}
        style={styles.player}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error: string) => {
          console.warn('video failed', error);
        }}
      />
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
      backgroundColor: colors.textPrimary,
    },
    player: {
      position: 'absolute',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
  });
};

export default VideoPlayer;
