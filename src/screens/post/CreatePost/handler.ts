import i18next from 'i18next';
import { Keyboard } from 'react-native';
import useUploaderStore from '~/store/uploader';
import showAlert from '~/store/helper/showAlert';
import showToast from '~/store/helper/showToast';

import useDraftPostStore from '../../YourContent/components/Draft/DraftPost/store';

export const handleBack = ({
  isEditPost,
  isEditPostHasChange,
  hasPostId,
  rootNavigation,
  isEditDraftPost,
  onPressDraftPost,
}: {
  isEditPost: boolean | undefined;
  isEditPostHasChange: boolean | undefined;
  hasPostId: boolean | undefined;
  rootNavigation: any;
  isEditDraftPost: boolean | undefined;
  onPressDraftPost: () => void;
}) => {
  Keyboard.dismiss();
  if (isEditPost) {
    if (isEditPostHasChange) {
      showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => rootNavigation?.goBack(),
      });
      return;
    }
  } else if (hasPostId) {
    const hasUploadingProcess = Object.keys(useUploaderStore.getState().uploadingFiles).length > 0;

    if (hasUploadingProcess) {
      showAlert({
        title: i18next.t('upload:title_leave_uploading'),
        content: i18next.t('upload:text_leave_uploading'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_leave'),
        confirmLabel: i18next.t('common:btn_stay_on_this_page'),
        onCancel: () => {
          useUploaderStore.getState().actions.cancelAllFiles();
          rootNavigation?.goBack();
        },
      });
      return;
    }
    useDraftPostStore.getState().actions.getDraftPosts({ isRefresh: true });
    showToast({
      content: 'post:saved_to_draft',
      buttonText: isEditDraftPost ? i18next.t('home:draft_post') : '',
      onButtonPress: onPressDraftPost,
    });
  }
  rootNavigation?.goBack();
};
