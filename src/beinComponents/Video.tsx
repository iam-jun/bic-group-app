import React, {createRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {default as RNVideo, VideoProperties} from 'react-native-video';
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import Icon from './Icon';

interface Props extends VideoProperties {
  source: any;
}

const Video: React.FC<Props> = ({source, ...props}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const videoRef = createRef<RNVideo>();
  const [videoPaused, setVideoPaused] = useState(true);

  const playVideo = () => {
    videoRef.current?.presentFullscreenPlayer();
  };

  return (
    <View style={styles.container}>
      <RNVideo
        {...props}
        ref={videoRef}
        style={styles.video}
        paused={videoPaused}
        source={source}
        onFullscreenPlayerDidDismiss={() => setVideoPaused(true)}
        onFullscreenPlayerDidPresent={() => setVideoPaused(false)}
      />
      <Icon
        style={styles.iconPlay}
        size={36}
        icon="PlayVideo"
        onPress={playVideo}
      />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      width: scaleSize(307),
      height: scaleSize(225.5),
      backgroundColor: colors.placeholder,
    },
    iconPlay: {
      position: 'absolute',
      zIndex: 1,
    },
  });
};

export default Video;
