import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const menuApiConfig = {
  getMyProfile: (userId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/profile`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const menuDataHelper = {
  getMyProfile: async (userId: number) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getMyProfile(userId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default menuDataHelper;
