import streamApi from '~/api/StreamApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IPinContentState } from '..';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

const navigation = withNavigation(rootNavigationRef);

const reorderPinContentGroup = (set, _get) => async (reorderedPinContent: string[], groupId: string) => {
  try {
    set((state: IPinContentState) => {
      state.isLoading = true;
    });

    const res = await streamApi.reorderPinContentGroup(reorderedPinContent, groupId);

    showToastSuccess(res);
    set((state: IPinContentState) => {
      state.isLoading = false;
      state.groupPinContent[groupId].data = reorderedPinContent;
    });
    navigation.goBack();
  } catch (e) {
    console.error('\x1b[35m🐣️ reorderPinContentGroup error: ', e, '\x1b[0m');
    set((state: IPinContentState) => {
      state.isLoading = false;
    });
    showToastError(e);
  }
};

export default reorderPinContentGroup;
