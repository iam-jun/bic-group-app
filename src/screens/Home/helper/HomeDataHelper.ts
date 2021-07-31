import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const homeApiConfig = {
  // TODO: will need to change API url
  getHomePosts: (userId: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}groups/${userId}/timeline`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const homeDataHelper = {
  getHomePosts: async (userId: number) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getHomePosts(userId),
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

export default homeDataHelper;
