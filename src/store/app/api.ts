import apiEndPoints from '~/constants/apiEndPoints';
import baseApi from '~/utils/baseAPI';

export const getConfigs = () => {
  return baseApi.get(apiEndPoints.configs);
};
