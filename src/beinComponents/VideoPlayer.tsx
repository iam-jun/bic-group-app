import React, {FC, useRef, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
// import Video from 'react-native-video';
// @ts-ignore
// import {default as RNVideoControls} from 'react-native-video-controls';
import {Video, AVPlaybackStatus} from 'expo-av';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import Button from '~/beinComponents/Button';

export interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  data: any;
}

const PLAYER_HEIGHT = scaleSize(232);

const VideoPlayer: FC<VideoPlayerProps> = ({style, data}: VideoPlayerProps) => {
  const video = useRef<any>(null);
  const [status, setStatus] = React.useState<any>({});

  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {url} = data || {};

  if (!url) {
    return null;
  }

  const onPlaybackStatusUpdate = (status: any) => {
    setStatus(status);
  };

  return (
    <View style={styles.container}>
      {/*<Video*/}
      {/*  ref={video}*/}
      {/*  style={styles.player}*/}
      {/*  // source={{uri: url}}*/}
      {/*  source={{*/}
      {/*    uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',*/}
      {/*  }}*/}
      {/*  useNativeControls*/}
      {/*  resizeMode={Video.RESIZE_MODE_CONTAIN}*/}
      {/*  isLooping*/}
      {/*  onPlaybackStatusUpdate={onPlaybackStatusUpdate}*/}
      {/*/>*/}
      <Button
        onPress={() =>
          status?.isPlaying
            ? video.current.pauseAsync()
            : video.current.playAsync()
        }
        style={{position: 'absolute', top: 0, left: 0, right: 0}}>
        {status?.isPlaying ? 'Stop' : 'Play'}
      </Button>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: 'black',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
    player: {
      position: 'absolute',
      width: '100%',
      height: PLAYER_HEIGHT,
    },
  });
};

export default VideoPlayer;
