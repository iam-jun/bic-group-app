import {StreamClient} from 'getstream';
import {makeGetStreamRequest} from '~/services/httpApiRequest';

const homeDataHelper = {
  getHomePosts: async (
    userId: string,
    streamClient?: StreamClient,
    offset?: number,
  ) => {
    if (streamClient) {
      const streamOptions = {
        offset: offset || 0,
        limit: 10,
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
    return Promise.reject('StreamClient not found');
  },
};

export default homeDataHelper;
