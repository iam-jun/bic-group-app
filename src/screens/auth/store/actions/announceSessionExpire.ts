import i18n from 'i18next';
import { IAuthState } from '~/screens/auth/store';
import showAlert from '~/store/helper/showAlert';
import useModalStore from '~/store/modal';

const announceSessionExpire = (set, get) => () => {
  const { actions, showingNoticeSession }: IAuthState = get() || {};
  if (showingNoticeSession) {
    return;
  }

  set((state: IAuthState) => {
    state.showingNoticeSession = true;
  }, 'announceSessionExpire');
  showAlert({
    title: i18n.t('auth:text_kickout_title'),
    content: i18n.t('auth:text_kickout_desc'),
    onConfirm: () => {
      set((state: IAuthState) => {
        state.showingNoticeSession = false;
      }, 'announceSessionExpire');
      useModalStore.getState().actions.hideAlert();
      actions.signOut();
    },
    confirmLabel: i18n.t('auth:text_kickout_confirm_button'),
    cancelBtn: false,
    isDismissible: false,
  });
};

export default announceSessionExpire;
