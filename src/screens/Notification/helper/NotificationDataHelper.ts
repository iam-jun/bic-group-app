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
        'u-' + userId,
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

  /**
   * Send request to getstream to mark notifications as read
   * @param userId        integer       User id
   * @param streamClient  StreamClient  Stream Client
   * @returns
   */
  markAsReadAll: async (userId: string, streamClient: StreamClient) => {
    if (streamClient) {
      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        'u-' + userId,
        'get',
        {mark_read: true},
      );

      return data;
    }
    return;
  },

  /**
   * Send request to getstream to mark notifications as seen
   * @param userId        integer       User id
   * @param streamClient  StreamClient  Stream Client
   * @returns
   */
  markAsSeenAll: async (userId: string, streamClient: StreamClient) => {
    if (streamClient) {
      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        'u-' + userId,
        'get',
        {mark_seen: true},
      );

      return data;
    }
    return;
  },

  /**
   * Send request to getstream to mark notification as seen by activity id
   * @param userId        integer       User id
   * @param activityId    integer       Activity id
   * @param streamClient  StreamClient  Stream Client
   */
  markAsRead: async (
    userId: string,
    activityId: string,
    streamClient: StreamClient,
  ) => {
    if (streamClient) {
      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        'u-' + userId,
        'get',
        {mark_read: [activityId]},
      );
      return data;
    }
    return;
  },
};

export default notificationsDataHelper;
