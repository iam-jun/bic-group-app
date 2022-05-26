import {GiphyMedia} from '@giphy/react-native-sdk';
import {isEmpty} from 'lodash';
import React, {FC, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {uploadTypes} from '~/configs/resourceConfig';
import {IPostMedia} from '~/interfaces/IPost';
import PostPhotoPreview from '~/screens/Post/components/PostPhotoPreview';
import {ITheme} from '~/theme/interfaces';
import GifView from './GifView';

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
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {images} = media || {};

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
    if (giphy) {
      return <GifView giphy={giphy} />;
    }
    if (images && !isEmpty(images))
      return (
        <PostPhotoPreview
          data={images}
          uploadType={uploadTypes.commentImage}
          width={width}
          onLongPress={onLongPress}
          enableGalleryModal
        />
      );
    return null;
  };

  return (
    <View
      style={StyleSheet.flatten([styles.container, style])}
      onLayout={onLayout}>
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.tiny,
      borderRadius: spacing.borderRadius.small,
      overflow: 'hidden',
    },
  });
};

export default CommentMediaView;
