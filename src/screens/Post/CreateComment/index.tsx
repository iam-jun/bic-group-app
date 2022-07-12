import React, {FC, useRef, useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text as RNText,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {getResourceUrl, uploadTypes} from '~/configs/resourceConfig';
import {fontFamilies} from '~/theme/fonts';
import {
  IActivityDataImage,
  ICommentData,
  ICreatePostImage,
} from '~/interfaces/IPost';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PostInput from '~/beinComponents/inputs/PostInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import CommentToolbar from '~/screens/Post/components/CommentToolbar';
import ImagePicker from '~/beinComponents/ImagePicker';
import UploadingImage from '~/beinComponents/UploadingImage';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import {checkPermission} from '~/utils/permission';
import dimension from '~/theme/dimension';

const inputMinHeight = 66;
const isAndroid8 =
  Platform.OS === 'android' && parseInt(DeviceInfo.getSystemVersion()) === 8;
const isAnimated = isAndroid8;

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

  const inputHeightAnim = new Animated.Value(inputMinHeight);

  const mentionInputRef = useRef<any>();
  const refTextInput = useRef<any>();
  const {commentId, groupIds} = route?.params || {};

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const comment: ICommentData =
    useKeySelector(postKeySelector.commentById(commentId)) || {};
  const oldContent = comment?.content;
  const oldImages = comment?.media?.images;

  const loading = useKeySelector(postKeySelector.createComment.loading);
  const content = useKeySelector(postKeySelector.createComment.content);
  const image = useKeySelector(postKeySelector.createComment.image);

  const isContentHasChange = content !== oldContent;
  const isImageHasChange =
    selectedImg?.fileName !== oldImages?.[0]?.origin_name;
  const isEditHasChange = isImageHasChange || isContentHasChange;
  const isEmpty = !content?.trim?.() && !selectedImg?.fileName;

  const disableButton =
    (!isContentHasChange && !isImageHasChange) ||
    loading ||
    uploading ||
    isEmpty;
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
        url: name?.includes('http')
          ? name
          : getResourceUrl(uploadTypes.commentImage, name),
        fileName: origin_name,
        file,
      });
    }
  }, [oldContent, oldImages]);

  const onPressSave = () => {
    Keyboard.dismiss();
    if (commentId && comment) {
      const images = [];
      if (selectedImg) {
        const imageData: IActivityDataImage = {
          name: selectedImg?.url || selectedImg?.fileName || '',
          origin_name: selectedImg?.fileName,
          width: selectedImg?.file?.width,
          height: selectedImg?.file?.height,
        };
        images.push(imageData);
      }
      const newData: ICommentData = {content, media: {images}};
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
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle().then(file => {
          if (!file) return;
          setUploading(true);
          const image: ICreatePostImage = {
            fileName: file.filename,
            file: file,
          };
          setSelectedImg(image);
        });
      }
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
          title: t('common:label_discard_changes'),
          content: t('common:text_discard_warning'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: t('common:btn_continue_editing'),
          confirmLabel: t('common:btn_discard'),
          onConfirm: () => rootNavigation.goBack(),
        }),
      );
      return;
    }
    rootNavigation.goBack();
  };

  const onLayoutCloneText = (e: any) => {
    const height = e?.nativeEvent?.layout?.height;
    let newHeight = Math.max(inputMinHeight, height);
    if (isAndroid8) {
      //Avoid bug white screen on android 8
      newHeight = Math.min(500, newHeight);
    }
    Animated.timing(inputHeightAnim, {
      toValue: newHeight,
      useNativeDriver: false,
      duration: 0,
      easing: Easing.ease,
    }).start();
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

  const onPressInput = () => refTextInput?.current?.setFocus?.();

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
          style: {borderWidth: 0},
        }}
        onPressBack={onPressBack}
        onPressButton={onPressSave}
      />
      {isAnimated && (
        <View style={styles.textCloneContainer}>
          <RNText style={styles.textContentClone} onLayout={onLayoutCloneText}>
            {content + '\njust invisible line'}
          </RNText>
        </View>
      )}
      <TouchableOpacity
        style={styles.flex1}
        activeOpacity={1}
        onPress={onPressInput}>
        <Animated.ScrollView keyboardShouldPersistTaps={'handled'}>
          <Animated.View
            style={{
              height: isAnimated ? inputHeightAnim : undefined,
              zIndex: 5,
            }}>
            <MentionInput
              groupIds={groupIds || ''}
              disableAutoComplete={true}
              style={styles.flex1}
              textInputStyle={styles.flex1}
              mentionInputRef={mentionInputRef}
              ComponentInput={PostInput}
              componentInputProps={{
                modalStyle: styles.mentionInputModal,
                value: content,
                loading: loading,
                isHandleUpload: true,
                placeholder: t('post:placeholder_write_comment'),
                onChangeText,
                scrollEnabled: false,
                inputRef: refTextInput,
              }}
              autocompleteProps={{
                modalPosition: 'bottom',
                title: t('post:mention_title'),
                emptyContent: t('post:mention_empty_content'),
                showShadow: true,
                modalStyle: {maxHeight: 350},
              }}
            />
          </Animated.View>
          {renderImage()}
        </Animated.ScrollView>
      </TouchableOpacity>
      {showToolbar && <CommentToolbar onSelectImage={onSelectImage} />}
      <MentionBar />
      <KeyboardSpacer iosOnly />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {dimension, colors} = theme;
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
    textContentClone: {
      position: 'absolute',
      top: 13,
      left: 12,
      right: 12,
      opacity: 1,
      fontSize: dimension?.sizes.body,
      fontFamily: fontFamilies.OpenSans,
      color: colors.success,
    },
    textCloneContainer: {
      height: 0,
      overflow: 'hidden',
    },
  });
};

export default CreateComment;
