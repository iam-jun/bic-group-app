import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { get } from 'lodash';

export const useKeySelector = (
  key: string,
  filterFunction?: (stateData: any) => any,
) => useSelector(
  createSelector(
    (state) => get(state, key),
    filterFunction || ((stateData) => stateData),
  ),
);
