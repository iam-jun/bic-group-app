import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, StyleProp, ViewStyle, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {useRootNavigation} from '~/hooks/navigation';
import * as modalActions from '~/store/modal/actions';
import i18n from '~/localization';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {ICreatePostImage} from '~/interfaces/IPost';
import UploadingImage from '~/beinComponents/UploadingImage';
import postActions from '~/screens/Post/redux/actions';
import Button from '~/beinComponents/Button';
import {useBaseHook} from '~/hooks';
import ImagePicker from '~/beinComponents/ImagePicker';
import appConfig from '~/configs/appConfig';
import {showHideToastMessage} from '~/store/modal/actions';
import {uploadTypes} from '~/configs/resourceConfig';

const PostSelectImage = () => {
  const [currentImages, setCurrentImages] = useState<ICreatePostImage[]>([]);
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, dimension} = theme;
  const styles = createStyle(theme);

  const selectedImages: ICreatePostImage[] =
    useKeySelector(postKeySelector.createPost.images) || [];
  const selectedImagesDraft: ICreatePostImage[] =
    useKeySelector(postKeySelector.createPost.imagesDraft) || [];

  useEffect(() => {
    if (currentImages?.length === 0) {
      let data: any = [];
      if (selectedImages.length > 0) {
        data = selectedImages;
      }
      if (selectedImagesDraft?.length > 0) {
        data = selectedImagesDraft;
      }
      setCurrentImages(data);
    }
  }, [selectedImages, selectedImagesDraft]);

  const onPressBack = () => {
    dispatch(
      modalActions.showAlert({
        title: i18n.t('common:label_discard_changes'),
        content: i18n.t('common:text_discard_warning'),
        showCloseButton: true,
        cancelBtn: true,
        cancelLabel: i18n.t('common:btn_continue_editing'),
        confirmLabel: i18n.t('common:btn_discard'),
        onConfirm: () => {
          dispatch(postActions.setCreatePostImagesDraft([]));
          rootNavigation.goBack();
        },
        stretchOnWeb: true,
      }),
    );
  };

  const onPressSave = () => {
    dispatch(postActions.setCreatePostImagesDraft(currentImages));
    dispatch(postActions.setCreatePostImages(currentImages));
    rootNavigation.goBack();
  };

  const onUploadSuccess = (url: string, fileName: string) => {
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${fileName}: ${url}\x1b[0m`);
  };

  const onPressRemoveImage = (item: ICreatePostImage, index: number) => {
    const newList = currentImages.filter(
      (image, i) => image.fileName !== item.fileName || index !== i,
    );
    setCurrentImages(newList);
  };

  const onPressAddImage = () => {
    ImagePicker.openPickerMultiple().then(images => {
      const newImages: ICreatePostImage[] = [];
      images.map(item => {
        newImages.push({fileName: item.filename, file: item});
      });
      let newCurrentImages = [...currentImages, ...newImages];
      if (newCurrentImages.length > appConfig.postPhotoLimit) {
        newCurrentImages = newCurrentImages.slice(0, appConfig.postPhotoLimit);
        const errorContent = t('post:error_reach_upload_photo_limit').replace(
          '%LIMIT%',
          appConfig.postPhotoLimit,
        );
        dispatch(
          showHideToastMessage({
            content: errorContent,
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      }
      setCurrentImages(newCurrentImages);
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ICreatePostImage;
    index: number;
  }) => {
    const {file, fileName, url} = item || {};
    const {width = 1, height = 1} = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(dimension.deviceWidth, dimension.maxNewsfeedWidth);

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
        onPressRemove={() => onPressRemoveImage(item, index)}
      />
    );
  };

  const renderFooter = () => {
    if (currentImages?.length >= appConfig.postPhotoLimit) {
      return null;
    }
    return (
      <Button.Secondary leftIcon={'ImagePlus'} onPress={onPressAddImage}>
        {t('post:add_photo')}
      </Button.Secondary>
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.surface}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_edit_images'}
        buttonText={'common:btn_done'}
        buttonProps={{useI18n: true, testID: 'post_select_image.btn_done'}}
        onPressBack={onPressBack}
        onPressButton={onPressSave}
      />
      <FlatList
        data={currentImages || []}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListFooterComponent={renderFooter}
        keyExtractor={(item, index) =>
          `create_post_image_${index}_${item?.fileName}`
        }
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {backgroundColor: colors.background},
    item: {marginBottom: spacing.margin.large, alignSelf: 'center'},
  });
};

export default PostSelectImage;
