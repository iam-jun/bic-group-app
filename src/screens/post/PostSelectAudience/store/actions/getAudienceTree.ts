import groupApi from '~/api/GroupApi';
import ISelectAudienceState from '~/screens/post/PostSelectAudience/store/Interface';

const getAudienceTree = (set, _) => async () => {
  set((state: ISelectAudienceState) => {
    state.tree.loading = true;
  }, false, 'getAudienceTree');
  try {
    const response = await groupApi.getAudienceTree();
    set((state: ISelectAudienceState) => {
      state.tree = {
        loading: false,
        data: response?.data || [],
      };
    }, false, 'getAudienceTree');
  } catch (e) {
    set((state: ISelectAudienceState) => {
      state.tree = {
        loading: false,
        data: undefined,
      };
    }, false, 'getAudienceTree');
  }
};

export default getAudienceTree;
