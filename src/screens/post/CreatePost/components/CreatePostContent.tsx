import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import PostInput from '~/beinComponents/inputs/PostInput';
import UploadingFile from '~/beinComponents/UploadingFile';
import { uploadTypes } from '~/configs/resourceConfig';
import { useBaseHook } from '~/hooks';
import { useKeyboardStatus } from '~/hooks/keyboard';
import { IFilePicked } from '~/interfaces/common';
import { fontFamilies } from '~/theme/fonts';

import { CONTENT_MIN_HEIGHT, MIN_INPUT_HEIGHT } from '../constanst';
import { getTotalFileSize, isAndroidAnimated, useCalculateInputHeight } from '../helper';
import ToastAutoSave from './ToastAutoSave';
import FilesView from '~/components/FilesView';
import appConfig from '~/configs/appConfig';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import PostSelectImage from './PostSelectImage';
import PostVideoPlayer from '~/components/posts/PostVideoPlayer';
import LinkPreview from '~/components/LinkPreview';
import { IGetFile } from '~/store/uploader';
import useUploadImage from '../hooks/useUploadImage';
import { getImagePastedFromClipboard } from '~/utils/images';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import useCreatePostStore from '../store';

interface Props {
  groupIds: any[];
  useCreatePostData: any;
}

const Content = ({ groupIds, useCreatePostData }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { showToast } = useModalStore((state) => state.actions);

  const {
    isShowToastAutoSave,
    createPostData,
    video,
    files,
    handleChangeContent,
    handleUploadVideoSuccess,
    handleUploadFileSuccess,
    linkPreview,
    onCloseLinkPreview,
    loadLinkPreview,
  } = useCreatePostData;

  const { loading, content, id } = createPostData || {};
  const { lstLinkPreview } = linkPreview;
  const currentLinkPreview = lstLinkPreview[lstLinkPreview.length - 1];

  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const [photosHeight, setPhotosHeight] = React.useState<number>(0);
  const [inputHeight, setInputHeight] = React.useState<number>(0);
  const [contentInput, setContentInput] = React.useState<string>(content);

  const currentInputHeight = useRef<number>(CONTENT_MIN_HEIGHT);
  const refRNText = useRef<any>();
  const heightAnimated = useRef(new Animated.Value(CONTENT_MIN_HEIGHT)).current;
  const toastRef = useRef<any>();

  const { handleImage } = useUploadImage();

  const strGroupIds = groupIds.join(',');

  const { isOpen: isKeyboardOpen } = useKeyboardStatus();
  const isAnimated = isAndroidAnimated();
  const { totalSize } = getTotalFileSize(files);

  const newHeight = useCalculateInputHeight(
    inputHeight,
    photosHeight,
    isShowToastAutoSave,
    isKeyboardOpen,
  );

  useEffect(() => {
    if (content !== contentInput && isAnimated) {
      setContentInput(content);
    }
  }, [content]);

  useEffect(() => {
    if (isAnimated) {
      onLayoutAnimated();
    }
  }, [photosHeight, isShowToastAutoSave, inputHeight, isKeyboardOpen]);

  const onChangeText = (text: string) => {
    if (isAnimated) {
      setContentInput(text);
    }
    handleChangeContent(text);
  };

  const animatedTiming = (height: number) => {
    heightAnimated.stopAnimation();
    Animated.timing(heightAnimated, {
      toValue: height,
      duration: 0,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
    toastRef.current?.startAnimation();
  };

  const onLayoutAnimated = () => {
    if (currentInputHeight.current === newHeight) {
      return;
    }

    currentInputHeight.current = newHeight;
    animatedTiming(newHeight);
  };

  const onLayoutPhotoPreview = (e: any) => {
    setPhotosHeight(e?.nativeEvent?.layout?.height || 0);
  };

  const onRemoveVideo = () => {
    createPostStoreActions.updateCreatePost({ video: undefined });
  };

  const onRemoveFile = (file: IGetFile) => {
    const { name } = file;
    const newFiles = files.filter((fileItem: any) => fileItem.name !== name);
    createPostStoreActions.updateCreatePost({ files: newFiles });
  };

  const onUploadError = (type: string) => {
    showToast({
      content: t('upload:text_upload_error', {
        file_type: t(`file_type:${type}`),
      }),
      type: ToastType.ERROR,
    });
  };

  // only support for iOS
  const onPasteImage = (_, images) => {
    if (!isEmpty(video) || !isEmpty(files)) {
      showToast({
        content: t('upload:text_upload_error', {
          file_type: t('file_type:image'),
        }),
        type: ToastType.ERROR,
      });
      return;
    }

    const img = getImagePastedFromClipboard(images);

    if (img) {
      const imgPasted = {
        name: img.fileName,
        filename: img.fileName,
        type: img.type,
        size: img.fileSize,
        uri: img.uri,
      };
      const imgs = [imgPasted];

      handleImage(imgs);
    }
  };

  const onLayoutCloneText = (e: any) => {
    const height = e?.nativeEvent?.layout?.height || MIN_INPUT_HEIGHT;
    setInputHeight(height);
  };

  const remainingSize = appConfig.totalFileSize - totalSize;

  return (
    <>
      {isAnimated && (
        <View
          testID="create_post.clone_text_container"
          style={styles.textCloneContainer}
        >
          <RNText
            style={styles.textContentClone}
            onLayout={onLayoutCloneText}
            ref={refRNText}
          >
            {`${contentInput}.`}
          </RNText>
        </View>
      )}
      <ScrollView bounces={false} keyboardShouldPersistTaps="always">
        <View style={styles.flex1}>
          <Animated.View
            style={isAnimated ? { height: heightAnimated } : styles.flex1}
          >
            <MentionInput
              disableAutoComplete
              groupIds={strGroupIds}
              style={styles.flex1}
              textInputStyle={styles.flex1}
              autocompleteProps={{
                modalPosition: 'bottom',
                title: t('post:mention_title'),
                emptyContent: t('post:mention_empty_content'),
                showShadow: true,
                modalStyle: { maxHeight: 350 },
              }}
              ComponentInput={PostInput}
              componentInputProps={{
                value: content,
                onChangeText,
                scrollEnabled: false,
                onPasteImage,
              }}
              disabled={loading}
            />
            {currentLinkPreview && (
              <LinkPreview
                data={currentLinkPreview}
                loadLinkPreview={loadLinkPreview}
                onClose={onCloseLinkPreview}
                showClose
              />
            )}
            <View onLayout={onLayoutPhotoPreview}>
              <PostSelectImage />
              {video && video?.thumbnails?.length > 0 ? (
                <PostVideoPlayer
                  data={video}
                  postId={id || ''}
                  onPressClose={onRemoveVideo}
                />
              ) : video ? (
                <UploadingFile
                  uploadType={uploadTypes.postVideo}
                  file={video as IFilePicked}
                  onClose={onRemoveVideo}
                  onError={() => onUploadError('video')}
                  onSuccess={handleUploadVideoSuccess}
                />
              ) : null}
            </View>
            <Button activeOpacity={1}>
              <FilesView
                files={files}
                uploadType={uploadTypes.postFile}
                remainingSize={remainingSize}
                onRemoveFile={onRemoveFile}
                onError={() => onUploadError('file')}
                onSuccess={handleUploadFileSuccess}
              />
            </Button>
            <ToastAutoSave viewRef={toastRef} visible={isShowToastAutoSave} />
          </Animated.View>
        </View>
      </ScrollView>
    </>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    flex1: { flex: 1 },
    textContentClone: {
      position: 'absolute',
      top: 1,
      left: 12,
      right: 12,
      opacity: 0,
      fontSize: dimension?.sizes.bodyM,
      fontFamily: fontFamilies.BeVietnamProLight,
      color: colors.success,
    },
    textCloneContainer: { height: 0, overflow: 'hidden' },
    buttonSettings: {
      backgroundColor: colors.gray40,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default Content;
