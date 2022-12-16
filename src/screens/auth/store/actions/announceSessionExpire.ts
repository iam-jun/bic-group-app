import i18n from 'i18next';
import { put } from 'redux-saga/effects';
import { IAuthState } from '~/screens/auth/store';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const announceSessionExpire = (set, get) => () => {
  const { actions, showingNoticeSession }: IAuthState = get() || {};
  if (showingNoticeSession) {
    return;
  }

  set((state: IAuthState) => {
    state.showingNoticeSession = true;
  }, 'announceSessionExpire');
  Store.store.dispatch(modalActions.showAlert({
    title: i18n.t('auth:text_kickout_title'),
    content: i18n.t('auth:text_kickout_desc'),
    onConfirm: () => {
      set((state: IAuthState) => {
        state.showingNoticeSession = false;
      }, 'announceSessionExpire');
      put(modalActions.hideAlert());
      actions.signOut();
    },
    confirmLabel: i18n.t('auth:text_kickout_confirm_button'),
    cancelBtn: false,
    isDismissible: false,
  }));
};

export default announceSessionExpire;
