import {createSelector} from 'reselect';
import {IObject} from '~/interfaces/common';

export const authState = (state: IObject<any>) => state.auth;

export const authUserSelector = createSelector(
  authState,
  data => data?.user || null,
);

export const userProfileSelector = createSelector(
  authState,
  data => data?.userProfile || null,
);
