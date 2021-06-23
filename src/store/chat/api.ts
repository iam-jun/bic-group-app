import apiEndPoints from '~/constants/apiEndPoints';
import baseApi from '~/utils/baseAPI';

export const getChannel = (id: string) => {
  return baseApi.get(`${apiEndPoints.channel}/${id}`);
};
