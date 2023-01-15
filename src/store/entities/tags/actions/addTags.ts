import { isArray } from 'lodash';
import { ITag } from '~/interfaces/ITag';

const addTags = (set, get) => (data: ITag | ITag[]) => {
  try {
    let lstTags: ITag[] = [];

    if (isArray(data)) {
      lstTags = [...data];
    } else {
      lstTags.push(data);
    }

    const newItems = lstTags.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    set({
      tags: {
        ...get().tags,
        ...newItems,
      },
    }, 'addTags');
  } catch (e) {
    console.error('addTags error', e);
  }
};

export default addTags;
