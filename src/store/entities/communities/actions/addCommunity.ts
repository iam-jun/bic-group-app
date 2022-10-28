import { isArray } from 'lodash';
import { ICommunity } from '~/interfaces/ICommunity';

const addCommunity = (set, get) => (data: ICommunity | ICommunity[]) => {
  try {
    let lstCommunity: ICommunity[] = [];

    if (isArray(data)) lstCommunity = [...data];
    else lstCommunity.push(data);

    const newItems = lstCommunity.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    set({
      data: {
        ...get().data,
        ...newItems,
      },
    }, 'addCommunity');
  } catch (e) {
    console.error('addCommunity error', e);
  }
};

export default addCommunity;
