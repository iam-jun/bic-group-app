import i18next from 'i18next';
import { put } from 'redux-saga/effects';

import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';

export default function* showToastEditSuccess(editFieldName: string): any {
  try {
    let toastContent: string;
    if (editFieldName) {
      toastContent = `${editFieldName} ${i18next.t('common:text_updated_successfully')}`;
    } else {
      toastContent = 'common:text_edit_success';
    }

    const toastMessage: IToastMessage = {
      content: toastContent,
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error(
      '\x1b[31m', '🐣️ showToastEditSuccess error: ', e, '\x1b[0m',
    );
  }
}
