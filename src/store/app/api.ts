import apiEndPoints from '~/constants/apiEndPoints';
import baseAPI from '~/utils/baseAPI';

export const getConfigs = () => {
  return baseAPI.get(apiEndPoints.configs);
};
