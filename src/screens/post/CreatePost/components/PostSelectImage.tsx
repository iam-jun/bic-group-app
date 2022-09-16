import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    url: string, fileName: string, index:number,
  ) => {
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${fileName}: ${url}\x1b[0m`);
    const newList = [];
    for (let imageIndex = 0; imageIndex < selectedImagesDraft.length; imageIndex++) {
      const image = selectedImagesDraft[imageIndex];
      if (imageIndex === index) {
        newList.push({ ...image, fileName, uploading: false });
        // eslint-disable-next-line no-continue
        continue;
      }
      newList.push(image);
    }
    dispatch(postActions.setCreatePostImagesDraft(newList));
    dispatch(postActions.setCreatePostImages(newList));
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

  const renderItem = (item, index) => {
    const { file, fileName, url } = item || {};
    const { width = 1, height = 1 } = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(
      dimension.deviceWidth, dimension.maxNewsfeedWidth,
    );

    return (
      <UploadingImage
        key={`create_post_image_${index}_${item?.fileName}`}
        uploadType={uploadTypes.postImage}
        style={styles.item}
        file={file}
        fileName={fileName}
        url={url}
        width={dfWidth}
        height={dfWidth * ratio}
        onUploadSuccess={(url: string, fileName: string) => { onUploadSuccess(url, fileName, index); }}
        onPressRemove={() => onPressRemoveImage(
          item, index,
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {selectedImagesDraft?.map?.(renderItem)}
    </View>
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
