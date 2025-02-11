import groupApi from '~/api/GroupApi';
import { ISelectAudienceState } from '..';

const getAudienceTree = (set, _) => async () => {
  set((state: ISelectAudienceState) => {
    state.tree.loading = true;
  });
  try {
    const response = await groupApi.getAudienceTree();
    set((state: ISelectAudienceState) => {
      state.tree = {
        loading: false,
        data: response?.data || [],
      };
    }, 'getAudienceTree');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.tree = {
        loading: false,
        data: undefined,
      };
    }, 'getAudienceTree');
  }
};

export default getAudienceTree;
