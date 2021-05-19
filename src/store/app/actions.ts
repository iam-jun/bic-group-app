import {IParams} from '~/utils/withParams';
import * as Actions from './constants';

export const getConfigs = () => ({
  type: Actions.GET_CONFIGS,
});

export const setConfigs = (themes: Array<IParams>, moods: Array<IParams>) => ({
  type: Actions.SET_CONFIGS,
  themes,
  moods,
});
