import useModalStore from '../modal';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const showToastSuccess = (response: any, defaultContent = 'common:text_success_message') => {
  const toast: IToastMessage = {
    content: response?.meta?.message || defaultContent,
    type: ToastType.SUCCESS,
  };

  useModalStore.getState().actions.showToast(toast);
};

export default showToastSuccess;
