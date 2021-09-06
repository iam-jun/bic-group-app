import apiEndPoints from '~/constants/apiEndPoints';
import baseAPI from '~/utils/baseAPI';

export const getChannel = (id: string) => {
  return baseAPI.get(`${apiEndPoints.channel}/${id}`);
};
