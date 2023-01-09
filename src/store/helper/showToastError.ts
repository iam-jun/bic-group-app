import APIErrorCode from '~/constants/apiErrorCode';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToast from '~/store/helper/showToast';

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

  showToast(toast);
};

export default showToastError;
