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
        withOwnReactions: true,
        withOwnChildren: false,
        withRecentReactions: true,
        withReactionCounts: true,
        enrich: true, //extra data for user & group
      };

      const data = await makeGetStreamRequest(
        streamClient,
        'newsfeed',
        `u-${userId}`,
        'get',
        streamOptions,
      );

      return data.results;
    }
    return;
  },
};

export default homeDataHelper;
