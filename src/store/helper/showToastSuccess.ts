import showToast from '~/store/helper/showToast';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const showToastSuccess = (response: any, defaultContent = 'common:text_success_message') => {
  const toast: IToastMessage = {
    content: response?.meta?.message || defaultContent,
    type: ToastType.SUCCESS,
  };

  showToast(toast);
};

export default showToastSuccess;
