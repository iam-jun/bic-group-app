import i18next from 'i18next';
import Store from '~/storeRedux';

import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';

export default function showToastEditSuccess(editFieldName: string): any {
  try {
    let toastContent: string;
    if (editFieldName) {
      toastContent = `${editFieldName} ${i18next.t('common:text_updated_successfully')}`;
    } else {
      toastContent = 'common:text_edit_success';
    }

    const toastMessage: IToastMessage = { content: toastContent };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (e) {
    console.error(
      '\x1b[31m', '🐣️ showToastEditSuccess error: ', e, '\x1b[0m',
    );
  }
}
