import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as _ from 'lodash';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import UploadingImage from '~/beinComponents/UploadingImage';
import { Button } from '~/baseComponents';
import PostPhotoPreview from '~/components/posts/PostPhotoPreview';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { ICreatePostImage } from '~/interfaces/IPost';
import dimension from '~/theme/dimension';

import spacing, { borderRadius } from '~/theme/spacing';
import useUploaderStore, { IGetFile } from '~/store/uploader';
import useCreatePostStore from '../store';
import { useBaseHook } from '~/hooks';

const DeviceWidth = dimension.deviceWidth;
const WidthImageWithPadding = DeviceWidth - 48;
const MaxNewsFeedWidth = dimension.maxNewsfeedWidth;

const PostSelectImage = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const [isShowPreview, setShowPreview] = useState(false);

  const selectedImages = useCreatePostStore((state) => state.createPost.images || []);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const uploadedImage = useUploaderStore((state) => state.uploadedFiles);
  const uploadingImage = useUploaderStore((state) => state.uploadingFiles);
  const resetUploadStore = useUploaderStore((state) => state.reset);

  const imagePreviews = getImagePreviews(uploadedImage, selectedImages);
  const hasUploadingProcess = Object.keys(uploadingImage).length > 0;

  const onUploadSuccess = (
    file: IGetFile,
  ) => {
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${file?.name}: ${file?.url}\x1b[0m`);

    const newList = selectedImages.map((selectImage) => (selectImage?.file?.name === file?.name
      ? {
        ...selectImage, uploading: false, url: file?.url, id: file?.id,
      }
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

  const onPressRemoveAll = () => {
    resetUploadStore();
    createPostStoreActions.updateCreatePost({ images: [] });
  };

  const onPressPreview = () => {
    setShowPreview(!isShowPreview);
  };

  const renderRowButton = () => {
    if (hasUploadingProcess || imagePreviews?.length === 0) return null;

    return (
      <View style={[isShowPreview ? styles.rowBtnFloat : styles.rowBtn]}>
        <Button.Neutral
          type="ghost"
          useI18n
          onPress={onPressPreview}
        >
          {isShowPreview ? t('post:create_post:edit') : t('post:create_post:preview_image')}
        </Button.Neutral>
        <Button.Neutral
          type="ghost"
          useI18n
          onPress={onPressRemoveAll}
        >
          post:create_post:remove_all_image
        </Button.Neutral>
      </View>
    );
  };

  const renderItem = (item, index) => {
    const { file, fileName, url } = item || {};
    const { width = 1, height = 1 } = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(WidthImageWithPadding, MaxNewsFeedWidth);
    const lastItem = index === (Number(selectedImages?.length) - 1);

    return (
      <UploadingImage
        key={`create_post_image_${index}_${item?.fileName}`}
        uploadType={ResourceUploadType.postContent}
        style={[styles.item, !lastItem && styles.mbSmall]}
        styleError={[!lastItem && styles.mbSmall]}
        file={file}
        fileName={fileName}
        url={url}
        width="100%"
        height={dfWidth * ratio}
        onUploadSuccess={onUploadSuccess}
        onPressRemove={() => onPressRemoveImage(
          item, index,
        )}
        showThumbnail
      />
    );
  };

  const renderContent = () => {
    if (isShowPreview) {
      return (
        <View style={styles.boxPreviewImg}>
          {renderRowButton()}
          <PostPhotoPreview
            data={imagePreviews}
            uploadType={ResourceUploadType.postContent}
          />
        </View>
      );
    }

    return (
      <View style={styles.boxListImage}>
        {renderRowButton()}
        {selectedImages?.map?.(renderItem)}
      </View>
    );
  };

  if (!selectedImages || selectedImages?.length === 0) return null;

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.large,
    },
    boxListImage: {
      borderWidth: 1,
      borderColor: colors.neutral5,
      borderRadius: borderRadius.large,
      padding: spacing.padding.small,
    },
    item: {
      alignSelf: 'center',
    },
    mbSmall: {
      marginBottom: spacing.margin.small,
    },
    rowBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.margin.small,
    },
    rowBtnFloat: {
      width: '100%',
      paddingTop: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
    },
    boxPreviewImg: {
      marginHorizontal: -spacing.padding.large,
    },
  });
};

export default PostSelectImage;

const getImagePreviews = (uploadedImg, selectedImgs) => {
  const result = [];

  selectedImgs.forEach((item) => {
    if (item?.url) {
      result.push({
        ...item,
        width: item?.file?.width || 1,
        height: item?.file?.height || 1,
      });
    } else if (_.has(uploadedImg, item?.fileName)) {
      result.push({
        ...uploadedImg?.[item?.fileName],
        width: item?.file?.width || 1,
        height: item?.file?.height || 1,
      });
    }
  });

  return result;
};
