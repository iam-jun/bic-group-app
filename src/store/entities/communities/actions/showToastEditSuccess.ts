import i18next from 'i18next';

import { IToastMessage } from '~/interfaces/common';
import useModalStore from '~/store/modal';

export default function showToastEditSuccess(editFieldName: string): any {
  let toastContent: string;
  if (editFieldName) {
    toastContent = `${editFieldName} ${i18next.t('common:text_updated_successfully')}`;
  } else {
    toastContent = 'common:text_edit_success';
  }

  const toastMessage: IToastMessage = { content: toastContent };
  useModalStore.getState().actions.showToast(toastMessage);
}
