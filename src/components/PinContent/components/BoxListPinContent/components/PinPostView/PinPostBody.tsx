import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import PinPostImage from './PinPostImage';
import PinPostFile from './PinPostFile';
import PinPostVideo from './PinPostVideo';
import PinPostContent from './PinPostContent';
import { spacing } from '~/theme';

interface PinPostBodyProps {
    data: IPost;
}

const PinPostBody: React.FC<PinPostBodyProps> = ({ data }) => {
  const { media, content, mentions } = data || {};
  const { images, videos, files } = media || {};

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
    <View style={styles.container}>
      <PinPostContent
        data={content}
        mentions={mentions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default PinPostBody;
