import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IPost } from '~/interfaces/IPost';
import PinPostImage from './PinPostImage';
import PinPostFile from './PinPostFile';
import PinPostVideo from './PinPostVideo';
import PinPostContent from './PinPostContent';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';

const WidthDevice = Dimensions.get('window').width;
const WidthBoxBottomPadding = WidthDevice * 0.8;

interface PinPostBodyProps {
    data: IPost;
}

const PinPostBody: React.FC<PinPostBodyProps> = ({ data }) => {
  const { media, content, mentions } = data || {};
  const { images, videos, files } = media || {};

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  if (!content && images?.length !== 0) {
    return (
      <PinPostImage
        data={images}
        uploadType="postImage"
      />
    );
  }

  if (!content && videos?.length !== 0) {
    return (
      <PinPostVideo
        data={videos?.[0]}
      />
    );
  }

  if (!content && files?.length !== 0) {
    return (
      <PinPostFile
        data={files}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <PinPostContent
          data={content}
          mentions={mentions}
        />
      </View>
      <View style={styles.boxPadding}/>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
    },
    boxPadding: {
      height: spacing.padding.large,
      backgroundColor: colors.white,
      width: WidthBoxBottomPadding,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomLeftRadius: borderRadius.large,
      borderBottomRightRadius: borderRadius.large,
      borderColor: colors.purple5,
      marginBottom: -1.5,
      marginLeft: -1,
    },
  });
};

export default PinPostBody;
