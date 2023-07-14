import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { showAlertRefreshPage } from '~/helpers/common';
import APIErrorCode from '~/constants/apiErrorCode';
import usePreviewJoinableGroupStore from '.';

export const getPreviewJoinableGroup = async (groupId: string) => {
  try {
    usePreviewJoinableGroupStore.setState((state) => {
      state.loading = true;
      return state;
    });

    const response = await groupApi.getPreviewJoinableGroup(groupId);

    usePreviewJoinableGroupStore.setState((state) => {
      state.loading = false;
      state.data = [response?.data];
      return state;
    });

    if (response?.data?.children?.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    if (
      error?.code === APIErrorCode.Group.MISSIING_MEMBERSHIP_ANSWERS
      || error?.code === APIErrorCode.Common.FORBIDDEN
    ) {
      showAlertRefreshPage();
      return;
    }
    console.error('getPreviewJoinableGroup', error);
    showToastError(error);
    throw new Error(error);
  }
};
