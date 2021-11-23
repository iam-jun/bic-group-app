import {StreamClient} from 'getstream';
import {makeGetStreamRequest, makeHttpRequest} from '~/services/httpApiRequest';
import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IParamGetSearchPost} from '~/interfaces/IHome';
import apiConfig from '~/configs/apiConfig';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

const homeApiConfig = {
  getSearchPost: (param: IParamGetSearchPost): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}posts`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params: {
      content: param?.content,
      actors: param?.actors,
      start_time: param?.start_time,
      end_time: param?.end_time,
      offset: param?.offset,
      limit: param?.limit,
    },
  }),
};

const homeDataHelper = {
  getHomePosts: async (
    userId: string,
    streamClient?: StreamClient,
    offset?: number,
  ) => {
    if (streamClient && userId) {
      const streamOptions = {
        offset: offset || 0,
        limit: 15,
        user_id: `${userId}`, //required for CORRECT own_reactions data
        ownReactions: true,
        recentReactionsLimit: 10,
        withOwnReactions: true,
        withOwnChildren: true, //return own_children of reaction to comment
        withRecentReactions: true,
        withReactionCounts: true,
        enrich: true, //extra data for user & group
        ranking: 'important_first', //important posts will on top of results
      };
      try {
        const data = await makeGetStreamRequest(
          streamClient,
          'newsfeed',
          `u-${userId}`,
          'get',
          streamOptions,
        );
        return Promise.resolve(data?.results || []);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject('StreamClient or UserId not found');
  },
  getSearchPost: async (param: IParamGetSearchPost) => {
    try {
      const response: any = await makeHttpRequest(
        homeApiConfig.getSearchPost(param),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUsers: async (params: IParamsGetUsers) => {
    try {
      const response: any = await makeHttpRequest(
        apiConfig.App.getUsers(params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data?.data);
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default homeDataHelper;
