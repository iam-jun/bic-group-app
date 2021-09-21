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
import {uploadTypes} from '~/services/fileUploader';
import postActions from '~/screens/Post/redux/actions';

const PostSelectImage = () => {
  const [currentImages, setCurrentImages] = useState<ICreatePostImage[]>([]);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const selectedImages: ICreatePostImage[] =
    useKeySelector(postKeySelector.createPost.images) || [];
  const selectedImagesDraft: ICreatePostImage[] =
    useKeySelector(postKeySelector.createPost.imagesDraft) || [];

  useEffect(() => {
    if (currentImages?.length === 0) {
      if (selectedImagesDraft?.length > 0) {
        setCurrentImages(selectedImagesDraft);
      }
      if (selectedImages.length > 0) {
        setCurrentImages(selectedImages);
      }
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
    dispatch(postActions.setCreatePostImages(currentImages));
    rootNavigation.goBack();
  };

  const onUploadSuccess = (url: string, fileName: string) => {
    console.log(`\x1b[36m🐣️ index onUploadSuccess ${fileName}: ${url}\x1b[0m`);
  };

  const renderItem = ({item}: {item: ICreatePostImage}) => {
    const {file, fileName, url} = item || {};
    return (
      <UploadingImage
        uploadType={uploadTypes.postImage}
        file={file}
        fileName={fileName}
        url={url}
        onUploadSuccess={onUploadSuccess}
      />
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_edit_images'}
        buttonText={'common:btn_done'}
        buttonProps={{useI18n: true}}
        onPressBack={onPressBack}
        onPressButton={onPressSave}
      />
      <FlatList
        data={currentImages || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => `create_post_image_${index}`}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostSelectImage;
