import React, { useMemo } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Image, View, StyleSheet } from 'react-native';
import Icon from '~/baseComponents/Icon';
import { getThumbnailImageLink } from '~/helpers/post';
import spacing from '~/theme/spacing';

const ASPECT_RATIO = 0.9;

interface PinPostVideoProps {
    data: any;
}

const PinPostVideo: React.FC<PinPostVideoProps> = ({
  data,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { url, thumbnails } = data || {};
  const posterInfo = useMemo(() => getThumbnailImageLink(thumbnails), [thumbnails]);

  if (!thumbnails || thumbnails?.length === 0 || !url) return null;

  const imageRatio = (posterInfo?.width || 1) / (posterInfo?.height || 1);
  const isVertical = imageRatio <= ASPECT_RATIO;

  const renderBlurImageBackground = () => {
    if (!isVertical) return null;

    return (
      <Image
        testID="pin_post_video.blur_video"
        source={{ uri: posterInfo?.url }}
        style={styles.blurImageBg}
        blurRadius={22}
      />
    );
  };

  const renderPlayButton = () => (
    <View style={styles.boxButtonPlay}>
      <Icon size={52} tintColor={colors.white} icon="CirclePlay" />
    </View>
  );

  return (
    <View style={styles.container} testID="pin_post_video.content">
      {renderBlurImageBackground()}
      <Image
        source={{ uri: posterInfo?.url }}
        resizeMode="cover"
        style={[
          styles.posterVideo,
          isVertical && styles.widthVerticle,
        ]}
      />
      {renderPlayButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: spacing.margin.small,
  },
  posterVideo: {
    width: '100%',
    height: '100%',
  },
  widthVerticle: {
    width: '46%',
  },
  blurImageBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  boxButtonPlay: {
    zIndex: 2,
    position: 'absolute',
    opacity: 0.7,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PinPostVideo;
