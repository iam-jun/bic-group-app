import { put } from 'redux-saga/effects';
import modalActions from '~/storeRedux/modal/actions';
import API_ERROR_CODE from '~/constants/apiErrorCode';

function* showError(err: any) {
  if (err.code === API_ERROR_CODE.COMMON.SYSTEM_ISSUE) return;

  yield put(modalActions.showHideToastMessage({
    content:
        err?.meta?.errors?.[0]?.message
        || err?.meta?.message
        || 'common:text_error_message',
    props: {
      textProps: { useI18n: true },
      type: 'error',
    },
  }));
}

export default showError;
