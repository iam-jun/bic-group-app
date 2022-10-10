import groupApi from '~/api/GroupApi';

const getCommunity = (set, _) => async (id: string) => {
  try {
    set((state) => {
      state.currentCommunityId = id;
    });

    set((state) => {
      // Add community id to requestings
      state.requestings[id] = true;
      delete state.errors[id];
    }, 'getCommunity');

    const response = await groupApi.getCommunityDetail(id);

    set((state) => {
      // Remove community id from requestings when success
      delete state.requestings[id];
      state.data[id] = response.data;
    }, 'getCommunitySuccess');
  } catch (error) {
    set((state) => {
      // Remove community id from requestings when error
      delete state.requestings[id];
      state.errors[id] = error;
    }, 'getCommunityError');
  }
};

export default getCommunity;
