import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
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

const DURATION_CHECK_POINT = 5 * 1000;

export interface PostVideoPlayerProps {
  data: any;
  postId?: string;
  onWatchCheckPoint?: () => void;
  onPressClose?: () => void;
}

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

  const onPlaybackStatusUpdate = async (status: any) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (status?.isLoaded && (status?.durationMillis - status?.positionMillis <= 100)) {
      video.current.resetVideoPosition();
    }

    if (status?.isPlaying) {
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

  const handlePlaybackStatusUpdate = debounce(onPlaybackStatusUpdate, 100);
  const posterInfo = useMemo(() => getThumbnailImageLink(thumbnails), [thumbnails]);

  if (!url && thumbnails?.length < 1) {
    return null;
  }

  return (
    <View style={[styles.container]}>
      <VideoPlayer
        testID="video_player"
        ref={video}
        key={`video_item_${postId}`}
        style={styles.player}
        src={url}
        posterInfo={posterInfo}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      {!!onPressClose
          && (
          <TouchableOpacity
            testID="post_video_player.close"
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
      // height: '100%',
      flex: 1,
      justifyContent: 'center',
    },
    player: {
      position: 'absolute',
      // width: '100%',
      // height: '100%',
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
