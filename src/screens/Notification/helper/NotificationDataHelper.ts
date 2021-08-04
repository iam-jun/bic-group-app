import {StreamClient} from 'getstream';
import {makeGetStreamRequest} from '~/services/httpApiRequest';

const notificationsDataHelper = {
  getNotificationList: async (userId: string, streamClient?: StreamClient) => {
    if (streamClient) {
      const streamOptions = {
        offset: 0,
        limit: 10,

        user_id: userId.toString(), //current user is userId, all reaction of userId will return in field own_reactions
        ownReactions: true,
        withOwnReactions: true,
        withOwnChildren: false,
        withRecentReactions: true, // tra về 10 reaction moi nhat
        withReactionCounts: true, // đếm số lượng reaction
        enrich: true, // giữ liệu sẽ được mở rộng ra, lấy thêm được thông tin user và group
      };

      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        userId,
        'get',
        streamOptions,
      );

      // console.log(
      //   '\x1b[36m',
      //   '🐣  | getNotificationData : ',
      //   JSON.stringify(data, undefined, 2),
      //   '\x1b[0m',
      // );

      return data;
    }
    return;
  },
};

export default notificationsDataHelper;
