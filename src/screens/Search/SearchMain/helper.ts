/* eslint-disable no-plusplus */
import { ISearchFilter } from '~/interfaces/ISearch';

export const getNumberActiveFilters = (filter: ISearchFilter) => {
  let count = 0;

  Object.values(filter || {}).forEach((value) => {
    if (!value) return;

    if (Array.isArray(value) && value.length > 0) {
      count++;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      count++;
    }
  });

  return count;
};
