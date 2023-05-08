import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import UploadingImage from '~/beinComponents/UploadingImage';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { ICreatePostImage } from '~/interfaces/IPost';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { IGetFile } from '~/store/uploader';
import useCreatePostStore from '../store';

const PostSelectImage = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const selectedImages = useCreatePostStore((state) => state.createPost.images || []);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const onUploadSuccess = (
    file: IGetFile,
  ) => {
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${file?.name}: ${file?.url}\x1b[0m`);

    const newList = selectedImages.map((selectImage) => (selectImage?.file?.name === file?.name
      ? { ...selectImage, uploading: false }
      : selectImage
    ));

    createPostStoreActions.updateCreatePost({ images: newList });
  };

  const onPressRemoveImage = (
    item: ICreatePostImage, index: number,
  ) => {
    const newList = selectedImages.filter((
      image, i,
    ) => image.fileName !== item.fileName || index !== i);

    createPostStoreActions.updateCreatePost({ images: newList });
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
        uploadType={ResourceUploadType.postContent}
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
    <View style={styles.container}>
      {selectedImages?.map?.(renderItem)}
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
