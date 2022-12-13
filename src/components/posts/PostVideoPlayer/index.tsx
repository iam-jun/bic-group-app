import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useEffect, useMemo,
} from 'react';
import {
  DeviceEventEmitter, StyleSheet, TouchableOpacity, View,
} from 'react-native';

import Icon from '~/baseComponents/Icon';
import VideoPlayer, { VideoPlayerRef } from '~/baseComponents/VideoPlayer';
import { getThumbnailImageLink } from '~/helpers/post';
import { spacing } from '~/theme';
import { scaleCoverHeight } from '~/theme/dimension';

const DURATION_CHECK_POINT = 5 * 1000;

export interface PostVideoPlayerProps {
  data: any;
  postId?: string;
  onWatchCheckPoint?: () => void;
  onPressClose?: () => void;
}

const PLAYER_HEIGHT = scaleCoverHeight();

const PostVideoPlayer: FC<PostVideoPlayerProps> = ({
  data,
  postId,
  onWatchCheckPoint,
  onPressClose,
}: PostVideoPlayerProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const video = React.useRef<VideoPlayerRef>();

  const { url, id, thumbnails } = data || {};

  useEffect(
    () => {
      const videoListener = DeviceEventEmitter.addListener(
        'playVideo',
        (videoId: any) => {
          if (!!videoId && videoId !== id) {
            video.current?.pause?.();
          }
        },
      );

      const stopVideoListener = DeviceEventEmitter.addListener(
        'stopAllVideo',
        async () => {
          video.current?.pause?.();
        },
      );
      return () => {
        videoListener?.remove?.();
        stopVideoListener?.remove?.();
      };
    }, [],
  );

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isPlaying) {
      // setLoading(false);
      DeviceEventEmitter.emit(
        'playVideo', id,
      );
    }

    if (((status?.durationMillis > DURATION_CHECK_POINT && status?.positionMillis >= DURATION_CHECK_POINT)
    || (status?.durationMillis <= DURATION_CHECK_POINT && status?.positionMillis === status?.durationMillis))
    && !!postId) {
      onWatchCheckPoint?.();
    }
  };

  if (!url && thumbnails?.length < 1) {
    return null;
  }

  const posterUrl = useMemo(() => getThumbnailImageLink(thumbnails), [thumbnails]);

  return (
    <View style={[styles.container]}>
      <VideoPlayer
        ref={video}
        key={`video_item_${postId}`}
        style={styles.player}
        src={url}
        thumbnail={posterUrl}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      {!!onPressClose
          && (
          <TouchableOpacity
            activeOpacity={url ? 0.85 : 1}
            onPress={onPressClose}
            style={styles.buttonClose}
          >
            <Icon size={16} tintColor={colors.gray20} icon="Xmark" />
          </TouchableOpacity>
          )}
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
    buttonClose: {
      position: 'absolute',
      zIndex: 2,
      borderRadius: spacing.borderRadius.circle,
      padding: spacing.padding.tiny,
      backgroundColor: colors.white,
      top: 8,
      right: 8,
    },
  });
};

export default PostVideoPlayer;
