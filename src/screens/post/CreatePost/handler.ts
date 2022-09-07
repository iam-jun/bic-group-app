import { ExtendedTheme } from '@react-navigation/native';
import i18next from 'i18next';
import { Keyboard } from 'react-native';
import FileUploader from '~/services/fileUploader';
import modalActions from '~/storeRedux/modal/actions';

import useDraftPostStore from '../DraftPost/store';

export const handleBack = (
  isEditPost: boolean | undefined,
  isEditPostHasChange: boolean | undefined,
  hasPostId: boolean | undefined,
  theme: ExtendedTheme,
  rootNavigation: any,
  dispatch: any,
  isNewsfeed: boolean | undefined,
  onPressDraftPost: () => void,
) => {
  const { colors } = theme;
  Keyboard.dismiss();
  if (isEditPost) {
    if (isEditPostHasChange) {
      dispatch(modalActions.showAlert({
        title: i18next.t('discard_alert:title'),
        content: i18next.t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_discard'),
        confirmLabel: i18next.t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      }));
      return;
    }
  } else if (hasPostId) {
    const hasUploadingProcess = FileUploader.getInstance().hasUploadingProcess();

    if (hasUploadingProcess) {
      dispatch(modalActions.showAlert({
        title: i18next.t('upload:title_leave_uploading'),
        content: i18next.t('upload:text_leave_uploading'),
        cancelBtn: true,
        cancelLabel: i18next.t('common:btn_leave'),
        confirmLabel: i18next.t('common:btn_stay_on_this_page'),
        onCancel: () => {
          FileUploader.getInstance().cancelAllFiles();
          rootNavigation.goBack();
        },
      }));
      return;
    }
    useDraftPostStore.getState().doGetDraftPosts({ isRefresh: true });
    dispatch(modalActions.showHideToastMessage({
      content: 'post:saved_to_draft',
      props: {
        buttonText: isNewsfeed ? i18next.t('home:draft_post') : '',
        onButtonPress: onPressDraftPost,
      },
    }));
  }
  rootNavigation.goBack();
};
