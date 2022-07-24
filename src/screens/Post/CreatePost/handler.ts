import {ExtendedTheme} from '@react-navigation/native';
import i18next from 'i18next';
import {Keyboard} from 'react-native';
import FileUploader from '~/services/fileUploader';
import modalActions from '~/store/modal/actions';

import spacing from '~/theme/spacing';
import postActions from '../redux/actions';

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
  const {colors} = theme;
  Keyboard.dismiss();
  if (isEditPost) {
    if (isEditPostHasChange) {
      dispatch(
        modalActions.showAlert({
          title: i18next.t('post:create_post:title_discard_changes'),
          content: i18next.t('post:alert_content_back_edit_post'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: i18next.t('common:btn_discard'),
          confirmLabel: i18next.t('post:create_post:btn_keep_edit'),
          onCancel: () => rootNavigation.goBack(),
        }),
      );
      return;
    }
  } else if (hasPostId) {
    const hasUploadingProcess =
      FileUploader.getInstance().hasUploadingProcess();

    if (hasUploadingProcess) {
      dispatch(
        modalActions.showAlert({
          title: i18next.t('upload:title_leave_uploading'),
          content: i18next.t('upload:text_leave_uploading'),
          cancelBtn: true,
          cancelLabel: i18next.t('common:btn_leave'),
          confirmLabel: i18next.t('common:btn_stay_on_this_page'),
          onCancel: () => {
            FileUploader.getInstance().cancelAllFiles();
            rootNavigation.goBack();
          },
        }),
      );
      return;
    }
    dispatch(postActions.getDraftPosts({isRefresh: true}));
    dispatch(
      modalActions.showHideToastMessage({
        content: 'post:saved_to_draft',
        props: {
          textProps: {
            useI18n: true,
            variant: 'bodyS',
            style: {color: colors.neutral80},
          },
          type: 'informative',
          leftIcon: 'CircleInfo',
          leftIconColor: colors.white,
          leftIconStyle: {
            backgroundColor: colors.neutral80,
            padding: spacing.padding.tiny,
          },
          leftStyle: {
            marginRight: spacing.margin.small,
          },
          style: {
            backgroundColor: colors.white,
            borderLeftWidth: 4,
            borderLeftColor: colors.neutral80,
            paddingHorizontal: spacing.padding.large,
            marginHorizontal: spacing.margin.base,
            marginBottom: spacing.margin.small,
            borderWidth: 1,
            borderColor: colors.gray20,
          },
          rightText: isNewsfeed ? i18next.t('home:draft_post') : '',
          rightTextColor: colors.neutral80,
          rightTextProps: {
            variant: 'bodySMedium',
          },
          rightTextStyle: {textDecorationLine: 'none'},
          onPressRight: onPressDraftPost,
        },
        toastType: 'normal',
      }),
    );
  }
  rootNavigation.goBack();
};
