import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
// @ts-ignore
import {default as RNVideoControls} from 'react-native-video-controls';

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

  const {url} = data || {};

  if (!url) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <RNVideoControls
        style={styles.player}
        source={{uri: url}}
        paused
        onError={(err: any) => console.log('Video ERROR', err)}
      />
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
