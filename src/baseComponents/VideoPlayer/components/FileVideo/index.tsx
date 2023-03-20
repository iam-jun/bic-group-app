import React, {
  FC, useImperativeHandle, useRef, useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { scaleCoverHeight } from '~/theme/dimension';
import Icon from '../../../Icon';
import { getVideoExtention } from '../../helper';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Button from '../../../Button';
import { VideoPlayerProps } from '../..';

export interface FileVideoRef {
  play: () => void,
  pause: () => void,
  resetVideoPosition: () => void,
}

const PLAYER_HEIGHT = scaleCoverHeight();

const FileVideo: FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  videoRef,
  isLooping = false,
  resizeMode = ResizeMode.CONTAIN,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const video = useRef<Video>();
  const [isPlaying, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const urlExtension = getVideoExtention(src);

  useImperativeHandle(videoRef, () => ({
    play,
    pause,
    resetVideoPosition,
  }));

  const play = async () => {
    if (video.current && !!src) {
      setLoading(true);
      try {
        await video.current?.loadAsync?.({
          uri: src,
          overrideFileExtensionAndroid: urlExtension,
        });
        setPlaying(true);
        video.current?.playAsync();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(
          '>>>>>>> Video loadAsync error >>>>>>>', error,
        );
      }
    }
  };

  const pause = async () => {
    const currentStatus = await video.current.getStatusAsync();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!currentStatus?.isPlaying) return;

    try {
      video.current.pauseAsync();
    } catch (error) {
      console.error(
        'STOP VIDEO FAILED>>>>>>>>>>', error,
      );
    }
  };

  const resetVideoPosition = async () => {
    if (!!video.current) {
      video.current.setStatusAsync({ positionMillis: 0, shouldPlay: false });
    }
  };

  if (!src && !thumbnail) return null;

  const renderThumbnail = () => {
    if (isPlaying) return null;

    return <Image style={styles.thumbnail} source={{ uri: thumbnail }} />;
  };

  const renderLoading = () => {
    if (!loading || isPlaying) return null;

    return <LoadingIndicator size={60} color={colors.gray20} />;
  };

  const renderPlayButton = () => {
    if (isPlaying || loading) return null;

    return (
      <Button
        TouchableComponent={TouchableOpacity}
        activeOpacity={src ? 0.85 : 1}
        style={styles.buttonPlay}
        onPress={play}
      >
        <Icon size={60} tintColor={colors.gray20} icon="CirclePlay" />
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Video
        {...props}
        ref={video}
        style={styles.player}
        useNativeControls
        resizeMode={resizeMode}
        isLooping={isLooping}
        onError={(error: string) => {
          console.warn(
            'video failed', error,
          );
        }}
      />
      {renderThumbnail()}
      {renderLoading()}
      {renderPlayButton()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      height: PLAYER_HEIGHT,
      justifyContent: 'center',
      backgroundColor: colors.black,
    },
    player: {
      position: 'absolute',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
    thumbnail: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      resizeMode: 'contain',
      backgroundColor: colors.black,
    },
    buttonPlay: {
      zIndex: 2,
      position: 'absolute',
      alignSelf: 'center',
    },
  });
};

export default React.forwardRef((
  props: VideoPlayerProps, ref?: React.MutableRefObject<FileVideoRef>,
) => (
  <FileVideo videoRef={ref} {...props} />
));
