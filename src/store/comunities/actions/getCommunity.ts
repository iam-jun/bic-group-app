import groupApi from '~/api/GroupApi';
import ICommunitiesState from '../Interface';

const getCommunity = (set, _) => async (id: string) => {
  try {
    set((state: ICommunitiesState) => {
      state.currentCommunityId = id;
    });

    set((state: ICommunitiesState) => {
      // Add community id to requestings
      state.requestings[id] = true;
      delete state.errors[id];
    }, 'getCommunity');

    const response = await groupApi.getCommunityDetail(id);

    set((state: ICommunitiesState) => {
      // Remove community id from requestings when success
      delete state.requestings[id];
      state.data[id] = response.data;
    }, 'getCommunitySuccess');
  } catch (error) {
    set((state: ICommunitiesState) => {
      // Remove community id from requestings when error
      delete state.requestings[id];
      state.errors[id] = error;
    }, 'getCommunityError');
  }
};

export default getCommunity;
