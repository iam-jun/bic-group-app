import {StreamClient} from 'getstream';
import {makeGetStreamRequest} from '~/services/httpApiRequest';

const notificationsDataHelper = {
  getNotificationList: async (
    userId: string,
    streamClient?: StreamClient,
    bottomNotiId?: string,
  ) => {
    if (streamClient) {
      const streamOptions: any = {
        limit: 20,
        user_id: userId.toString(), //current user is userId, all reaction of userId will return in field own_reactions
        ownReactions: true,
        withOwnReactions: true,
        withOwnChildren: false,
        withRecentReactions: true, // tra về 10 reaction moi nhat
        withReactionCounts: true, // đếm số lượng reaction
        enrich: true, // giữ liệu sẽ được mở rộng ra, lấy thêm được thông tin user và group
      };

      if (bottomNotiId) {
        streamOptions.id_lt = bottomNotiId;
      } else {
        streamOptions.offset = 0;
      }

      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        'u-' + userId,
        'get',
        streamOptions,
      );

      // because getstream not support check user own noti event
      // so this is a trick to hide current user's post event
      let countUnseenCurrentUserPostEvent = 0;
      data.results = data.results.filter(notiGroup => {
        if (notiGroup.verb === 'post') {
          const act = notiGroup.activities[0];
          if (act.actor.id === userId) {
            // if this is user own create post event and it is not seen
            // we must minute unseen count by 1
            // to make unseen number correct after we hide the noti
            if (!notiGroup.is_seen) {
              countUnseenCurrentUserPostEvent++;
            }
            return false;
          }
        }
        return true;
      });

      // update unseen number if there is any noti is hidden
      data.unseen =
        data.unseen - countUnseenCurrentUserPostEvent > 0
          ? data.unseen - countUnseenCurrentUserPostEvent
          : 0;
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
