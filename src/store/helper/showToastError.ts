import APIErrorCode from '~/constants/apiErrorCode';
import useModalStore from '../modal';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const showToastError = (error: any, type = ToastType.ERROR) => {
  /**
   * add errorType in case just want to show info message,
   * not really an error (not show icon error)
   */

  if (error.code === APIErrorCode.Common.SYSTEM_ISSUE) return;

  const toast: IToastMessage = {
    content: error?.meta?.errors?.[0]?.message
          || error?.meta?.message
          || 'common:text_error_message',
    type,
  };

  useModalStore.getState().actions.showToast(toast);
};

export default showToastError;
