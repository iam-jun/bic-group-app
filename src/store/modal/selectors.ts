import {createSelector} from 'reselect';

export const rootCommon = (state: any) => state.common;

export const getStatusLoaded = createSelector(
  rootCommon,
  data => data.get('loaded') || false,
);
