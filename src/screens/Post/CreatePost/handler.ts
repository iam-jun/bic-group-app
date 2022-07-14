import i18next from 'i18next';
import {Keyboard} from 'react-native';
import FileUploader from '~/services/fileUploader';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import postActions from '../redux/actions';

export const handleBack = (
  isEditPost: boolean | undefined,
  isEditPostHasChange: boolean | undefined,
  hasPostId: boolean | undefined,
  theme: ITheme,
  rootNavigation: any,
  dispatch: any,
  isNewsfeed: boolean | undefined,
  onPressDraftPost: () => void,
) => {
  const {colors, spacing} = theme;
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
          onDismiss: () => rootNavigation.goBack(),
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
          onDismiss: () => {
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
            style: {color: colors.textPrimary},
          },
          type: 'informative',
          leftIcon: 'CircleInfo',
          leftIconColor: colors.iconTintReversed,
          leftIconStyle: {
            backgroundColor: colors.iconTintLight,
            padding: spacing.padding.tiny,
          },
          leftStyle: {
            marginRight: spacing.margin.small,
          },
          style: {
            backgroundColor: colors.background,
            borderLeftWidth: 4,
            borderLeftColor: colors.iconTintLight,
            paddingHorizontal: spacing.padding.large,
            marginHorizontal: spacing.margin.base,
            marginBottom: spacing.margin.small,
            borderWidth: 1,
            borderColor: colors.bgFocus,
          },
          rightText: isNewsfeed ? i18next.t('home:draft_post') : '',
          rightTextColor: colors.textPrimary,
          rightTextProps: {
            variant: 'bodySM',
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
