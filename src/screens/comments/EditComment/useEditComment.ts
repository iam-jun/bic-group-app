import {
  useCallback, useEffect, useState,
} from 'react';
import { Keyboard } from 'react-native';
import { isEmpty } from 'lodash';

import {
  IActivityDataImage, ICommentData, ICreatePostImage, IPayloadPutEditComment,
} from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import useEditCommentController from './store';
import useCommentInputStore from '../components/CommentInputView/store';
import ICommentInputState from '../components/CommentInputView/store/Interface';
import ImageUploader from '~/services/imageUploader';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { useBaseHook } from '~/hooks';
import Store from '~/storeRedux';
import { checkPermission, permissionTypes } from '~/utils/permission';
import ImagePicker from '~/beinComponents/ImagePicker';
import { IGiphy } from '~/interfaces/IGiphy';
import { getResourceUrl, uploadTypes } from '~/configs/resourceConfig';
import { formatTextWithEmoji } from '~/utils/emojiUtils';
import { getImagePastedFromClipboard } from '~/utils/common';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const navigation = withNavigation(rootNavigationRef);

export interface IUseEditComment {
  commentId: string;
  mentionInputRef: any;
}

const useEditComment = ({ commentId, mentionInputRef }: IUseEditComment) => {
  const { t } = useBaseHook();

  const comment: ICommentData = useCommentsStore(useCallback(commentsSelector.getComment(commentId), [commentId]));
  const oldContent = comment?.content;
  const oldImages = comment?.media?.images;
  const oldGiphy = !!comment?.giphyId ? {
    id: comment?.giphyId,
    url: comment?.giphyUrl,
  } : undefined;

  const editController = useEditCommentController((state) => state.actions);
  const actions = useCommentInputStore((state: ICommentInputState) => state.actions);
  const createComment = useCommentInputStore((state: ICommentInputState) => state.createComment);
  const { loading } = createComment || {};
  const resetCreateComment = useCommentInputStore((state: ICommentInputState) => state.reset);

  const [text, setText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<ICreatePostImage>();
  const [selectedGiphy, setSelectedGiphy] = useState<IGiphy>();
  const [selectedEmoji, setSelectedEmoji] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const [contentLoading, setContentLoading] = useState(true);

  const { showToast, showAlert } = useModalStore((state) => state.actions);

  const isContentHasChange = text !== oldContent;
  const isImageHasChange = oldImages?.[0]?.origin_name
    ? selectedImage?.fileName !== oldImages[0].origin_name
    : oldImages?.[0]?.name
    && (selectedImage?.fileName !== oldImages[0].name);
  const isGifHasChange = oldGiphy?.id !== selectedGiphy?.id;
  const isEditHasChange = isImageHasChange || isGifHasChange || isContentHasChange;
  const isContentEmpty = !text?.trim?.() && !selectedImage?.fileName;

  const enableButtonSave = isEditHasChange && !isContentEmpty && (!loading || !uploading);
  const disableImageOption = !!selectedImage;
  const disableGifOption = !!selectedGiphy;

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

  useEffect(
    () => {
      if (oldContent) {
        setText(oldContent);
      }
      if (oldImages?.[0]) {
        const {
          name, origin_name, width, height,
        } = oldImages[0];
        const file: any = { width: width || 1, height: height || 1 };
        setSelectedImage({
          url: name?.includes('http')
            ? name
            : getResourceUrl(
              uploadTypes.commentImage, name,
            ),
          fileName: origin_name || name,
          file,
        });
      }
      if (oldGiphy) {
        setSelectedGiphy(oldGiphy);
      }
    }, [],
  );

  const clearState = () => {
    setUploading(false);
    setText('');
    setSelectedImage(undefined);
    setSelectedGiphy(undefined);
  };

  useEffect(() => {
    if (!!selectedEmoji) {
      const completeStr = formatTextWithEmoji(text, selectedEmoji);
      setText(completeStr);
      setSelectedEmoji('');
    }
  }, [selectedEmoji]);

  const handleContentChange = (newContent: string) => {
    setText(newContent);
    actions.setCreateComment({ content: newContent, image: undefined });
  };

  const handelSelectImage = () => {
    checkPermission(
      permissionTypes.photo, Store.store.dispatch, (canOpenPicker) => {
        if (canOpenPicker) {
          ImagePicker.openPickerSingle().then((file) => {
            if (!file) return;
            setUploading(true);
            const image: ICreatePostImage = {
              fileName: file.filename,
              file,
            };
            setSelectedImage(image);
            setSelectedGiphy(undefined);
          });
        }
      },
    );
  };

  const handleUploadImageSuccess = (url: string, filename: string) => {
    if (selectedImage?.fileName === filename) {
      setSelectedImage({ ...selectedImage, url });
    }
    setUploading(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(undefined);
    setUploading(false);
  };

  // only support for iOS
  const onPasteImage = (_, files) => {
    if (!isEmpty(selectedImage) || !isEmpty(selectedGiphy)) {
      showToast({
        content: t('upload:text_upload_error', {
          file_type: t('file_type:image'),
        }),
        type: ToastType.ERROR,
      });

      return;
    }
    setUploading(true);
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
      } as any);
    }
  };

  const handleSelectGiphy = useCallback((gif: IGiphy) => {
    setSelectedImage(undefined);
    setSelectedGiphy(gif);
  }, []);

  const handleRemoveGiphy = () => {
    setSelectedGiphy(undefined);
  };

  const handleSelectEmoij = useCallback((emoji: string) => {
    setSelectedEmoji(emoji);
  }, []);

  const handleSave = () => {
    Keyboard.dismiss();
    if (commentId && comment) {
      const images = [];
      let giphy;
      if (selectedImage) {
        const fileUploaded = ImageUploader.getInstance().getFile(selectedImage?.fileName);
        const imageData: IActivityDataImage = {
          id: fileUploaded?.result?.id,
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
      editController.editComment(payload);
    }
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

export default useEditComment;
