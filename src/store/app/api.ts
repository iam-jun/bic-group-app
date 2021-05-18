import {GET} from '~/constants/api';
import {axios} from '~/utils/api';
import withParams, {IParams} from '~/utils/withParams';

export const getMoods = (params?: Array<IParams>) => {
  return axios(GET, withParams('/moods', params));
};

export const getThemes = (params?: Array<IParams>) => {
  return axios(GET, withParams('/themes', params));
};
