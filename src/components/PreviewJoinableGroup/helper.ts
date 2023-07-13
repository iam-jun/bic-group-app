import groupApi from '~/api/GroupApi';
import usePreviewJoinableGroupStore from './store';
import showToastError from '~/store/helper/showToastError';

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
    console.error('getPreviewJoinableGroup', error);
    showToastError(error);
    throw new Error(error);
  }
};
