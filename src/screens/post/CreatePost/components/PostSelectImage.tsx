import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import UploadingImage from '~/beinComponents/UploadingImage';
import { uploadTypes } from '~/configs/resourceConfig';
import { useKeySelector } from '~/hooks/selector';
import { ICreatePostImage } from '~/interfaces/IPost';
import postKeySelector from '~/storeRedux/post/keySelector';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import postActions from '~/storeRedux/post/actions';

const PostSelectImage = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const selectedImagesDraft: ICreatePostImage[] = useKeySelector(postKeySelector.createPost.imagesDraft) || [];

  const onUploadSuccess = (
    url: string, fileName: string,
  ) => {
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${fileName}: ${url}\x1b[0m`);
  };

  const onPressRemoveImage = (
    item: ICreatePostImage, index: number,
  ) => {
    const newList = selectedImagesDraft.filter((
      image, i,
    ) => image.fileName !== item.fileName || index !== i);
    dispatch(postActions.setCreatePostImagesDraft(newList));
    dispatch(postActions.setCreatePostImages(newList));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ICreatePostImage;
    index: number;
  }) => {
    const { file, fileName, url } = item || {};
    const { width = 1, height = 1 } = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(
      dimension.deviceWidth, dimension.maxNewsfeedWidth,
    );

    return (
      <UploadingImage
        uploadType={uploadTypes.postImage}
        style={styles.item}
        file={file}
        fileName={fileName}
        url={url}
        width={dfWidth}
        height={dfWidth * ratio}
        onUploadSuccess={onUploadSuccess}
        onPressRemove={() => onPressRemoveImage(
          item, index,
        )}
      />
    );
  };

  return (
    <FlatList
      data={selectedImagesDraft || []}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      keyExtractor={(
        item, index,
      ) => `create_post_image_${index}_${item?.fileName}`}
    />
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: { backgroundColor: colors.white },
    item: { marginBottom: spacing.margin.large, alignSelf: 'center' },
  });
};

export default PostSelectImage;
