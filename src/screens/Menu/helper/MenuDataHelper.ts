import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import userProfileDataMocksResponse from './mockDataUserProfile';

export const menuApiConfig = {
  getMyProfile: (): HttpApiRequestConfig => ({
    // TODO: will need to change API URL
    url: `${ApiConfig.providers.bein.url}users/my-group`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const menuDataHelper = {
  getMyProfile: async () => {
    try {
      // TODO: will need to change response data
      const response: any = userProfileDataMocksResponse;
      // const response: any = await makeHttpRequest(menuApiConfig.getMyProfile());
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
