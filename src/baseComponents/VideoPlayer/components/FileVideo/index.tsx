import React, {
  FC, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  Video, ResizeMode, Audio, InterruptionModeIOS,
} from 'expo-av';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '../../../Icon';
import { getVideoExtention } from '../../helper';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Button from '../../../Button';
import { VideoPlayerProps } from '../..';
import { scaleCoverHeight } from '~/theme/dimension';

export interface FileVideoRef {
  play: () => void,
  pause: () => void,
  resetVideoPosition: () => void,
}

const PLAYER_HEIGHT = scaleCoverHeight();

const FileVideo: FC<VideoPlayerProps> = ({
  src,
  posterInfo,
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

  useEffect(() => {
    const setAudioMode = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      });
    };
    setAudioMode();
  }, []);

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
    if (video.current) {
      await video.current.setStatusAsync({
        positionMillis: 0, shouldPlay: false, isLooping: false,
      });
    }
  };

  if (!src && !posterInfo?.url) return null;

  const videoStyle = { width: posterInfo?.videoWidth || '100%', height: posterInfo?.videoHeight || PLAYER_HEIGHT };

  const renderThumbnail = () => {
    if (isPlaying) return null;

    return <Image style={[styles.thumbnail, videoStyle]} source={{ uri: posterInfo?.url }} />;
  };

  const renderBlurImageBackground = () => (
    <Image
      style={styles.blurImageBg}
      source={{ uri: posterInfo?.url }}
      blurRadius={22}
    />
  );

  const renderLoading = () => {
    if (!loading || isPlaying) return null;

    return <LoadingIndicator size={60} color={colors.gray20} style={styles.buttonPlay} />;
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
    <View style={[styles.container, {
      width: '100%', height: posterInfo?.videoHeight || PLAYER_HEIGHT,
    }]}
    >
      {renderBlurImageBackground()}
      <Video
        {...props}
        ref={video}
        style={[styles.player, videoStyle]}
        useNativeControls
        resizeMode={resizeMode}
        isLooping={isLooping}
        usePoster={Platform.OS === 'ios'}
        posterSource={{ uri: posterInfo?.url }}
        posterStyle={[styles.thumbnail, videoStyle]}
        onError={(error: string) => {
          console.warn(
            'video failed', error,
          );
        }}
      />
      {Platform.OS === 'android' && renderThumbnail()}
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
      justifyContent: 'center',
      backgroundColor: colors.black,
    },
    player: {
      alignSelf: 'center',
    },
    blurImageBg: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
    },
    thumbnail: {
      position: 'absolute',
      alignSelf: 'center',
      resizeMode: 'contain',
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
