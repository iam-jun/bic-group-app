import {createSelector} from 'reselect';
import {IObject} from '~/interfaces/common';

export const appState = (state: IObject<any>) => state.app;

export const moodsSelector = createSelector(
  appState,
  (data) => data?.configs?.moods || [],
);

export const themeSelector = createSelector(
  appState,
  (data) => data?.configs?.themes || [],
);
