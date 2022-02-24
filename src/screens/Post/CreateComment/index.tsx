import React, {FC, useRef, useEffect, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {
  IActivityData,
  IActivityDataImage,
  ICreatePostImage,
  IReaction,
} from '~/interfaces/IPost';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostInput from '~/beinComponents/inputs/PostInput';
import i18n from '~/localization';
import _MentionInput from '~/beinComponents/inputs/_MentionInput';
import CommentToolbar from '~/screens/Post/components/CommentToolbar';
import ImagePicker from '~/beinComponents/ImagePicker';
import UploadingImage from '~/beinComponents/UploadingImage';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';

export interface CreateCommentProps {
  route?: {
    params?: {
      commentId?: string;
      groupIds?: string;
    };
  };
}

const CreateComment: FC<CreateCommentProps> = ({route}: CreateCommentProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<ICreatePostImage>();

  const mentionInputRef = useRef<any>();
  const {commentId, groupIds} = route?.params || {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {dimension} = theme;
  const {colors} = theme;
  const styles = createStyle();

  const comment: IReaction =
    useKeySelector(postKeySelector.commentById(commentId)) || {};
  const oldContent = comment?.data?.content;
  const oldImages = comment?.data?.images;

  const loading = useKeySelector(postKeySelector.createComment.loading);
  const content = useKeySelector(postKeySelector.createComment.content);
  const image = useKeySelector(postKeySelector.createComment.image);

  const isContentHasChange = content !== oldContent;
  const isImageHasChange =
    selectedImg?.fileName !== oldImages?.[0]?.origin_name;
  const isEditHasChange = isImageHasChange || isContentHasChange;

  const disableButton =
    (!isContentHasChange && !isImageHasChange) || loading || uploading;
  const showToolbar = !selectedImg;

  useEffect(() => {
    dispatch(
      postActions.setCreateComment({
        content: oldContent || '',
        image: oldImages?.[0],
      }),
    );
    if (oldContent && !mentionInputRef?.current?.getContent?.()) {
      mentionInputRef?.current?.setContent?.(oldContent);
    }
    if (oldImages?.[0]) {
      const {name, origin_name, width, height} = oldImages[0];
      const file: any = {width: width || 1, height: height || 1};
      setSelectedImg({
        url: getResourceUrl(uploadTypes.commentImage, name),
        fileName: origin_name,
        file,
      });
    }
  }, [oldContent, oldImages]);

  const onPressSave = () => {
    Keyboard.dismiss();
    if (commentId && comment) {
      const imageData: IActivityDataImage = {
        name: selectedImg?.url || selectedImg?.fileName || '',
        origin_name: selectedImg?.fileName,
        width: selectedImg?.file?.width,
        height: selectedImg?.file?.height,
      };
      const newData: IActivityData = {content, images: [imageData]};
      console.log(`\x1b[35m🐣️ index onPressSave `, newData, `\x1b[0m`);
      dispatch(
        postActions.putEditComment({
          id: commentId,
          comment: comment,
          data: newData,
        }),
      );
    }
  };

  const onSelectImage = () => {
    ImagePicker.openPickerSingle().then(file => {
      if (!file) return;
      setUploading(true);
      const image: ICreatePostImage = {fileName: file.filename, file: file};
      setSelectedImg(image);
    });
  };

  const onChangeText = (text: string) => {
    dispatch(postActions.setCreateComment({content: text, image}));
  };

  const onPressBack = () => {
    Keyboard.dismiss();

    if (isEditHasChange) {
      dispatch(
        modalActions.showAlert({
          title: i18n.t('common:label_discard_changes'),
          content: i18n.t('common:text_discard_warning'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: i18n.t('common:btn_continue_editing'),
          confirmLabel: i18n.t('common:btn_discard'),
          onConfirm: () => rootNavigation.goBack(),
          stretchOnWeb: true,
        }),
      );
      return;
    }
    rootNavigation.goBack();
  };

  const onUploadImageSuccess = (url: string, filename: string) => {
    if (selectedImg?.fileName === filename) {
      setSelectedImg({...selectedImg, url});
    }
    setUploading(false);
  };

  const onRemoveImage = () => {
    setSelectedImg(undefined);
    setUploading(false);
  };

  const renderImage = () => {
    if (!selectedImg) {
      return null;
    }
    const {file, fileName, url} = selectedImg;
    const {width = 1, height = 1} = file || {};
    const ratio = height / width;
    const dfWidth = Math.min(dimension.deviceWidth, dimension.maxNewsfeedWidth);

    return (
      <UploadingImage
        uploadType={uploadTypes.commentImage}
        style={{alignSelf: 'center'}}
        file={file}
        fileName={fileName}
        url={url}
        width={dfWidth}
        height={dfWidth * ratio}
        onUploadSuccess={onUploadImageSuccess}
        onPressRemove={onRemoveImage}
      />
    );
  };

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_edit_comment'}
        buttonText={'common:btn_save'}
        buttonProps={{
          loading: loading,
          disabled: disableButton,
          useI18n: true,
          highEmphasis: true,
        }}
        onPressBack={onPressBack}
        onPressButton={onPressSave}
      />
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <_MentionInput
          groupIds={groupIds || ''}
          mentionInputRef={mentionInputRef}
          style={styles.flex1}
          textInputStyle={styles.flex1}
          ComponentInput={PostInput}
          componentInputProps={{
            modalStyle: styles.mentionInputModal,
            value: content,
            loading: loading,
            isHandleUpload: true,
            placeholder: i18n.t('post:placeholder_write_comment'),
            onChangeText,
          }}
          autocompleteProps={{
            modalPosition: 'top',
            title: i18n.t('post:mention_title'),
            emptyContent: i18n.t('post:mention_empty_content'),
            modalStyle: styles.mentionInputModal,
          }}
        />
        {renderImage()}
      </ScrollView>
      {showToolbar && <CommentToolbar onSelectImage={onSelectImage} />}
    </ScreenWrapper>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    container: {},
    flex1: {flex: 1},
    mentionInputModal: {
      position: undefined,
      top: undefined,
      bottom: undefined,
      marginTop: -12,
      maxHeight: 180,
    },
  });
};

export default CreateComment;
