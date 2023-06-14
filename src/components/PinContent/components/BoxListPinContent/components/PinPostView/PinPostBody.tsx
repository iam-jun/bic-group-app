import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ExtendedTheme, useRoute, useTheme } from '@react-navigation/native';
import { IPost } from '~/interfaces/IPost';
import PinPostImage from './PinPostImage';
import PinPostFile from './PinPostFile';
import PinPostVideo from './PinPostVideo';
import PinPostContent from './PinPostContent';
import { spacing } from '~/theme';
import { borderRadius } from '~/theme/spacing';
import { ResourceUploadType } from '~/interfaces/IUpload';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

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

  const { name } = useRoute();
  const isReorderScreen = name === homeStack.reorderedPinContent;

  if (!content && images?.length !== 0) {
    return (
      <PinPostImage
        data={images}
        uploadType={ResourceUploadType.postContent}
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
      <View style={[styles.boxPadding,
        { width: isReorderScreen ? '100.5%' : WidthBoxBottomPadding },
      ]}
      />
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
      marginBottom: -1.5,
      marginLeft: -1,
    },
  });
};

export default PinPostBody;
