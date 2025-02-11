import { GiphyMedia } from '@giphy/react-native-sdk';
import { isEmpty } from 'lodash';
import React, { FC, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { PostPhotoPreview } from '~/components/posts';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { IPostMedia } from '~/interfaces/IPost';
import spacing from '~/theme/spacing';
import GifView from '~/components/GiphyView';

export interface CommentMediaViewProps {
  style?: StyleProp<ViewStyle>;
  giphy: GiphyMedia;
  media: IPostMedia;
  onLongPress?: (e: any) => void;
}

const CommentMediaView: FC<CommentMediaViewProps> = ({
  style,
  giphy,
  media,
  onLongPress,
}: CommentMediaViewProps) => {
  const [width, setWidth] = useState();

  const { images } = media || {};

  const onLayout = (e: any) => {
    const width = e?.nativeEvent?.layout?.width;
    if (width) {
      setWidth(width);
    }
  };

  if (!width) {
    return <View onLayout={onLayout} />;
  }

  const renderContent = () => {
    if (images && !isEmpty(images)) {
      return (
        <PostPhotoPreview
          data={images}
          uploadType={ResourceUploadType.commentContent}
          width={width}
          onLongPress={onLongPress}
          enableGalleryModal
        />
      );
    }
    if (giphy) {
      return (
        <GifView giphy={giphy} />
      );
    }
    return null;
  };

  if (!giphy && (!images || images.length === 0)) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      onLayout={onLayout}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.margin.tiny,
    borderRadius: spacing.borderRadius.small,
    overflow: 'hidden',
  },
});

export default CommentMediaView;
