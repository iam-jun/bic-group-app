import errorCode from '~/constants/errorCode';
import {put} from 'redux-saga/effects';
import modalActions from '~/store/modal/actions';

function* showError(err: any) {
  if (err.code === errorCode.systemIssue) return;

  yield put(
    modalActions.showHideToastMessage({
      content:
        err?.meta?.errors?.[0]?.message ||
        err?.meta?.message ||
        'common:text_error_message',
      props: {
        textProps: {useI18n: true},
        type: 'error',
      },
    }),
  );
}

export default showError;
