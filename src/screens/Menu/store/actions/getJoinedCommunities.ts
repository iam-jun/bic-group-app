import groupApi from '~/api/GroupApi';

const getJoinedCommunities = (set, _get) => async (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => {
  try {
    set((state) => { state.loading = true; });
    const response = await groupApi.getJoinedCommunities(params);

    set((state) => {
      state.loading = false;
      state.data = response.data || [];
    }, 'getJoinedCommunitiesSuccess');
  } catch (error) {
    console.warn('\x1b[35m🐣️ joinedCommunities error ', error, '\x1b[0m');
    set((state) => {
      state.loading = false;
    }, 'getJoinedCommunitiesError');
  }
};

export default getJoinedCommunities;
