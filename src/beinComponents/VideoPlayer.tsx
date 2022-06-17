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
import {Video, AVPlaybackStatus, ResizeMode} from 'expo-av';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';

export interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  data: any;
}

const PLAYER_HEIGHT = scaleSize(232);

const VideoPlayer: FC<VideoPlayerProps> = ({style, data}: VideoPlayerProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const video = React.useRef(null);
  const {url, id} = data || {};

  useEffect(() => {
    console.log('PixelRatio', PixelRatio.get());

    const showBottomBarListener = DeviceEventEmitter.addListener(
      'stopPlayingVideo',
      (videoId: any) => {
        if (!!videoId && videoId !== id) {
          video.current?.setStatusAsync?.({shouldPlay: false});
        }
      },
    );
    return () => {
      showBottomBarListener?.remove();
    };
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isPlaying) {
      DeviceEventEmitter.emit('stopPlayingVideo', id);
    }
  };

  if (!url) {
    return null;
  }

  return (
    <View style={[styles.container]}>
      <Video
        ref={video}
        source={{
          uri: url,
          overrideFileExtensionAndroid: 'm3u8',
        }}
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
      backgroundColor: colors.borderDisable,
    },
    player: {
      position: 'absolute',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
  });
};

export default VideoPlayer;
