import {
  GiphyMedia,
  GiphyMediaView,
  GiphyRendition,
} from '@giphy/react-native-sdk';
import React, {useRef, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';

interface Props {
  style?: StyleProp<ViewStyle>;
  giphy: GiphyMedia;
}

const GifView = ({style, giphy}: Props) => {
  const mediaRef = useRef<GiphyMediaView | null>(null);
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const [playing, setPlaying] = useState(false);

  const onGifPress = () => {
    if (playing) mediaRef.current?.pause();
    else mediaRef.current?.resume();

    setPlaying(!playing);
  };

  return (
    <View style={[styles.container, style]}>
      <GiphyMediaView
        ref={mediaRef}
        media={giphy}
        style={styles.giphy}
        autoPlay={false}
        renditionType={GiphyRendition.DownsizedMedium}
      />
      <ButtonWrapper style={styles.iconPlayGif} onPress={onGifPress}>
        <Icon icon="iconPlayGif" size={playing ? 0 : 56} />
      </ButtonWrapper>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    giphy: {
      width: '100%',
      aspectRatio: 1,
    },
    iconPlayGif: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default GifView;
