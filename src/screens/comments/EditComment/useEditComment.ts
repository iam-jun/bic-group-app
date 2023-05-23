import {
  MutableRefObject, useCallback, useEffect, useRef, useState,
} from 'react';
import { Keyboard } from 'react-native';

import { t } from 'i18next';
import { isEmpty } from 'lodash';
import { PastedFile } from 'react-native-paste-image-input';
import {
  IActivityDataImage, ICommentData, ICreatePostImage, IPayloadPutEditComment,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import useEditCommentController from './store';
import useCommentInputStore from '../components/CommentInputView/store';
import ICommentInputState from '../components/CommentInputView/store/Interface';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { checkPermission, PermissionTypes } from '~/utils/permission';
import { IGiphy } from '~/interfaces/IGiphy';
import { formatTextWithEmoji } from '~/utils/emojis';
import useModalStore from '~/store/modal';
import useUploaderStore, { IGetFile } from '~/store/uploader';
import showToastError from '~/store/helper/showToastError';
import ImagePicker from '~/components/ImagePicker';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { getImagePastedFromClipboard } from '~/utils/images';
import { IToastMessage } from '~/interfaces/common';

const navigation = withNavigation(rootNavigationRef);

export interface IUseEditComment {
  commentId: string;
  mentionInputRef: any;
}

const useEditComment = ({ commentId, mentionInputRef }: IUseEditComment) => {
  const comment: ICommentData = useCommentsStore(useCallback(commentsSelector.getComment(commentId), [commentId]));
  const oldContent = comment?.content;
  const oldImages = comment?.media?.images;
  const oldGiphy = !!comment?.giphyId ? {
    id: comment?.giphyId,
    url: comment?.giphyUrl,
  } : undefined;

  const { editComment } = useEditCommentController((state) => state.actions);
  const actions = useCommentInputStore((state: ICommentInputState) => state.actions);
  const createComment = useCommentInputStore((state: ICommentInputState) => state.createComment);
  const { loading } = createComment || {};
  const resetCreateComment = useCommentInputStore((state: ICommentInputState) => state.reset);

  const [text, setText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<ICreatePostImage>();
  const [selectedGiphy, setSelectedGiphy] = useState<IGiphy>();
  const [selectedEmoji, setSelectedEmoji] = useState<string>();

  const [contentLoading, setContentLoading] = useState(true);
  const cursorPosition = useRef(0);

  const { showToast, showAlert } = useModalStore((state) => state.actions);

  const uploadedFile = useUploaderStore(useCallback(
    (state) => state.uploadedFiles[selectedImage?.file?.name], [selectedImage],
  ));
  const uploadError = useUploaderStore(useCallback(
    (state) => state.errors[selectedImage?.file?.name], [selectedImage],
  ));

  const disableImageOption = !!selectedImage;
  const disableGifOption = !!selectedGiphy;
  const isUploading = useUploaderStore.getState().uploadingFiles?.[selectedImage?.file?.name] >= 0;

  const isContentEmpty = !text?.trim?.()?.length;
  const isContentHasChange = !isContentEmpty && text?.trim?.() !== oldContent;
  const isImageHasChange = checkImageHasChange({ oldImages, selectedImage, disableImageOption });
  const isGifHasChange = oldGiphy?.id !== selectedGiphy?.id;
  const isEditHasChange = isImageHasChange || isGifHasChange || isContentHasChange;

  const isHasCommentContent = !isContentEmpty || disableImageOption || disableGifOption;
  const enableButtonSave = isHasCommentContent && isEditHasChange && (!loading || !isUploading);

  useEffect(
    () => {
      actions.setCreateComment({ content: '', loading: false });
      const loadingTimer = setTimeout(() => {
        setContentLoading(false);
      }, 100);

      return () => {
        clearTimeout(loadingTimer);
        resetCreateComment();
        clearState();
      };
    }, [],
  );

  useEffect(
    () => {
      if (oldContent && !mentionInputRef?.current?.getContent?.()) {
        actions.setCreateComment({ content: oldContent });
        mentionInputRef?.current?.setContent?.(oldContent);
      }
    }, [oldContent],
  );

  useEffect(() => {
    setStateByOldData({
      oldContent,
      oldImages,
      oldGiphy,
      setText,
      setSelectedImage,
      setSelectedGiphy,
    });
  }, []);

  useEffect(() => {
    shouldShowToastError(uploadError);
  }, [uploadError]);

  const clearState = () => {
    setText('');
    setSelectedImage(undefined);
    setSelectedGiphy(undefined);
  };

  useEffect(() => {
    shouldSetText({
      text, setText, selectedEmoji, cursorPosition, setSelectedEmoji,
    });
  }, [selectedEmoji]);

  const handleContentChange = (newContent: string) => {
    setText(newContent);
    actions.setCreateComment({ content: newContent, image: undefined });
  };

  const handelSelectImage = () => {
    checkPermission(PermissionTypes.photo, (canOpenPicker) => {
      shouldImagePicker({ canOpenPicker, setSelectedImage, setSelectedGiphy });
    });
  };

  const handleUploadImageSuccess = (file: IGetFile) => {
    if (selectedImage?.fileName === file?.name) {
      setSelectedImage({ ...selectedImage, url: file?.url });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(undefined);
  };

  // only support for iOS
  const onPasteImage = (_, files) => {
    _onPasteImage({
      files,
      selectedImage,
      selectedGiphy,
      setSelectedImage,
      getImagePastedFromClipboard,
      showToast,
    });
  };

  const handleSelectGiphy = useCallback((gif: IGiphy) => {
    setSelectedImage(undefined);
    setSelectedGiphy(gif);
  }, []);

  const handleRemoveGiphy = () => {
    setSelectedGiphy(undefined);
  };

  const handleSelectEmoij = useCallback((emoji: string, position: any) => {
    setSelectedEmoji(emoji);
    cursorPosition.current = position;
  }, []);

  const handleSave = () => {
    Keyboard.dismiss();
    shouldEditComment({
      commentId,
      comment,
      selectedImage,
      selectedGiphy,
      uploadedFile,
      editComment,
      text,
    });
  };

  const handleBack = () => {
    Keyboard.dismiss();

    if (isEditHasChange) {
      showAlert({
        title: t('common:label_discard_changes'),
        content: t('common:text_discard_warning'),
        cancelBtn: true,
        cancelLabel: t('common:btn_continue_editing'),
        confirmLabel: t('common:btn_discard'),
        onConfirm: () => navigation.goBack(),
      });
      return;
    }
    navigation.goBack();
  };

  return {
    contentLoading,
    disableButton: !enableButtonSave,
    giphy: selectedGiphy,
    content: text,
    selectedImage,
    disableImageOption,
    disableGifOption,
    handleUploadImageSuccess,
    handleRemoveImage,
    handelSelectImage,
    onPasteImage,
    handleContentChange,
    handleSelectGiphy,
    handleRemoveGiphy,
    handleSelectEmoij,
    handleSave,
    handleBack,
  };
};

const checkImageHasChange = (params: {
  oldImages: any[];
  selectedImage: ICreatePostImage;
  disableImageOption: boolean;
}) => {
  const { oldImages, selectedImage, disableImageOption } = params;
  /* eslint no-else-return: ["error", {allowElseIf: true}] */
  if (oldImages?.[0]?.origin_name) {
    return selectedImage?.fileName !== oldImages[0].origin_name;
  } else if (oldImages?.[0]?.name) {
    return selectedImage?.fileName !== oldImages[0].name;
  }
  return disableImageOption;
};

const setStateByOldData = (params: {
  oldContent: any;
  oldImages: any;
  oldGiphy: any;
  setText: (value: string) => void;
  setSelectedImage: (image: ICreatePostImage) => void;
  setSelectedGiphy: (giphy: IGiphy) => void;
}) => {
  const {
    oldContent, oldImages, oldGiphy, setText, setSelectedImage, setSelectedGiphy,
  } = params;
  if (oldContent) {
    setText(oldContent);
  }
  if (oldImages?.[0]) {
    const {
      name, origin_name, width, height, url,
    } = oldImages[0];
    const file: any = { width: width || 1, height: height || 1 };
    setSelectedImage({
      url,
      fileName: origin_name || name,
      file,
    });
  }
  if (oldGiphy) {
    setSelectedGiphy(oldGiphy);
  }
};

const shouldShowToastError = (uploadError: string) => {
  if (uploadError) {
    const content = typeof uploadError === 'string' ? uploadError : t('post:error_upload_photo_failed');
    showToastError(content);
  }
};

const shouldImagePicker = (params: {
  canOpenPicker: boolean;
  setSelectedImage: (image: ICreatePostImage) => void;
  setSelectedGiphy: (giphy: IGiphy) => void;
}) => {
  const { canOpenPicker, setSelectedImage, setSelectedGiphy } = params;
  if (canOpenPicker) {
    ImagePicker.openPickerSingle().then((file) => {
      if (!file) return;
      const image: ICreatePostImage = {
        fileName: file.filename,
        file,
      };
      setSelectedImage(image);
      setSelectedGiphy(undefined);
    });
  }
};

const _onPasteImage = (params: {
  files: any[];
  selectedImage: ICreatePostImage;
  selectedGiphy: IGiphy;
  setSelectedImage: (image: ICreatePostImage) => void;
  getImagePastedFromClipboard: (files: any) => PastedFile;
  showToast: (payload: IToastMessage) => void;
}) => {
  const {
    files, selectedImage, selectedGiphy, setSelectedImage, getImagePastedFromClipboard, showToast,
  } = params;
  if (!isEmpty(selectedImage) || !isEmpty(selectedGiphy)) {
    showToast({
      content: t('upload:text_upload_error', {
        file_type: t('file_type:image'),
      }),
      type: ToastType.ERROR,
    });
    return;
  }
  const img = getImagePastedFromClipboard(files);
  if (img) {
    setSelectedImage({
      fileName: img.fileName,
      file: {
        name: img.fileName,
        filename: img.fileName,
        type: img.type,
        size: img.fileSize,
        uri: img.uri,
      },
    });
  }
};

const shouldEditComment = (params: {
  commentId: string;
  comment: any;
  selectedImage: ICreatePostImage;
  selectedGiphy: IGiphy;
  uploadedFile: IGetFile;
  text: string;
  editComment: (payload: IPayloadPutEditComment) => void;
}) => {
  const {
    commentId, comment, selectedImage, selectedGiphy, uploadedFile, text, editComment,
  } = params;
  if (commentId && comment) {
    const images = [];
    let giphy;
    if (selectedImage) {
      const imageData: IActivityDataImage = {
        id: uploadedFile?.result?.id,
        name: selectedImage?.url || selectedImage?.fileName || '',
        origin_name: selectedImage?.fileName,
        width: selectedImage?.file?.width,
        height: selectedImage?.file?.height,
      };
      images.push(imageData);
    }
    if (selectedGiphy) {
      giphy = {
        id: selectedGiphy?.id,
      };
    }
    const newData: ICommentData = {
      content: text,
      media: { images },
      giphy,
    };
    const payload = {
      id: commentId,
      comment,
      data: newData,
    } as IPayloadPutEditComment;
    editComment(payload);
  }
};

const shouldSetText = (params: {
  text: string;
  selectedEmoji: any;
  cursorPosition: MutableRefObject<number>;
  setText: (value: string) => void;
  setSelectedEmoji: (value: string) => void;
}) => {
  const {
    text, selectedEmoji, cursorPosition, setText, setSelectedEmoji,
  } = params;
  if (!!selectedEmoji) {
    const completeStr = formatTextWithEmoji(text, selectedEmoji, cursorPosition.current);
    setText(completeStr);
    setSelectedEmoji('');
  }
};

export default useEditComment;
