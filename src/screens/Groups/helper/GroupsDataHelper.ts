import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const groupsApiConfig = {
  getMyGroups: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/my-group`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
};

const groupsDataHelper = {
  getMyGroups: async () => {
    try {
      const response: any = await makeHttpRequest(
        groupsApiConfig.getMyGroups(),
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

export default groupsDataHelper;
