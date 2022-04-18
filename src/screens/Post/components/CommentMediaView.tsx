import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {IPostMedia} from '~/interfaces/IPost';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import {uploadTypes} from '~/configs/resourceConfig';

export interface CommentMediaViewProps {
  style?: StyleProp<ViewStyle>;
  media: IPostMedia;
  onLongPress?: (e: any) => void;
}

const CommentMediaView: FC<CommentMediaViewProps> = ({
  style,
  media,
  onLongPress,
}: CommentMediaViewProps) => {
  const [width, setWidth] = useState();

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {images} = media || {};

  const onLayout = (e: any) => {
    const width = e?.nativeEvent?.layout?.width;
    if (width) {
      setWidth(width);
    }
  };

  if (!images || images?.length === 0) {
    return null;
  }

  if (!width) {
    return <View onLayout={onLayout} />;
  }

  return (
    <View
      style={StyleSheet.flatten([styles.container, style])}
      onLayout={onLayout}>
      <PostPhotoPreview
        data={images}
        uploadType={uploadTypes.commentImage}
        width={width}
        onLongPress={onLongPress}
        enableGalleryModal
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.tiny,
      borderRadius: spacing.borderRadius.small,
      overflow: 'hidden',
    },
  });
};

export default CommentMediaView;
