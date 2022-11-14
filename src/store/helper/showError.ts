import modalActions from '~/storeRedux/modal/actions';
import APIErrorCode from '~/constants/apiErrorCode';
import Store from '~/storeRedux';

const showError = (err: any, errorType: 'neutral' | 'error' = 'error') => {
  /**
   * add errorType in case just want to show info message,
   * not really an error (not show icon error)
   */

  if (err.code === APIErrorCode.Common.SYSTEM_ISSUE) return;
  Store.store.dispatch(modalActions.showHideToastMessage(
    {
      content:
        err?.meta?.errors?.[0]?.message
        || err?.meta?.message
        || 'common:text_error_message',
      props: { type: errorType },
    },
  ));
};

export default showError;
