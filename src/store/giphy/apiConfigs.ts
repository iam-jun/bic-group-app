import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IParamGetGroupPosts} from '~/interfaces/IGroup';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const giphyApiConfig = {
  getAPIKey: (params?: IParamGetGroupPosts): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinFeed.url}api/v1/authorization/giphy-key`,
    method: 'get',
    provider: ApiConfig.providers.beinFeed,
    useRetry: true,
    params,
  }),
};

const giphyDataHelper = {
  getAPIKey: async (params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        giphyApiConfig.getAPIKey(params),
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

export default giphyDataHelper;
