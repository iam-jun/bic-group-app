import groupApi from '~/api/GroupApi';
import { IManagedState } from '../Interface';

const getOwnerCommunity
  = (set, _) => async () => {
    try {
      const response = await groupApi.getOwnerCommunity();

      if (!response.data) {
        throw new Error('Incorrect response');
      }

      const { data } = response;
      const newIds = data.map((item) => item.id);
      const newItems = data.reduce(
        (accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: currentItem,
        }),
        {},
      );

      set((state: IManagedState) => {
        state.owner.hasNextPage = false;
        state.owner.ids = newIds;
        state.owner.items = newItems;
      },
      'getOwnerCommunitySuccess');
    } catch (e) {
      console.error(
        '\x1b[31m🐣️ getOwnerCommunity error: ',
        e,
        '\x1b[0m',
      );
    }
  };

export default getOwnerCommunity;
