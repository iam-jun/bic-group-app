import {StreamClient} from 'getstream';
import {makeGetStreamRequest, makeHttpRequest} from '~/services/httpApiRequest';
import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IParamGetNotifications} from '~/interfaces/INotification';

const LIMIT = 20;

export const notificationApiConfig = {
  getNotifications: (params: IParamGetNotifications): HttpApiRequestConfig => {
    const {limit, ...restParams} = params || {};
    return {
      url: `${ApiConfig.providers.beinFeed.url}api/notifications`,
      method: 'get',
      provider: ApiConfig.providers.beinFeed,
      useRetry: true,
      params: {
        limit: limit || LIMIT,
        ...restParams,
      },
    };
  },
  putMarkAsReadById: (id: string): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinFeed.url}api/notifications/${id}/mark-as-read`,
      method: 'put',
      provider: ApiConfig.providers.beinFeed,
      useRetry: true,
    };
  },
  putMarkAllAsRead: (): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinFeed.url}api/notifications/all/mark-as-read`,
      method: 'put',
      provider: ApiConfig.providers.beinFeed,
      useRetry: true,
    };
  },
  putMarkAllAsSeen: (): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinFeed.url}api/notifications/mark-as-seen`,
      method: 'put',
      provider: ApiConfig.providers.beinFeed,
      useRetry: true,
    };
  },
};

const notificationsDataHelper = {
  getDefaultLoadNotiOptions: (userId: string) => {
    const options: any = {
      user_id: userId.toString(), //current user is userId, all reaction of userId will return in field own_reactions
      ownReactions: true,
      withOwnReactions: true,
      withOwnChildren: false,
      withRecentReactions: true, // tra về 10 reaction moi nhat
      withReactionCounts: true, // đếm số lượng reaction
      enrich: true, // giữ liệu sẽ được mở rộng ra, lấy thêm được thông tin user và group
    };
    return options;
  },

  getNotificationList: async (param: IParamGetNotifications) => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.getNotifications(param),
      );
      if (response && response?.data?.data) {
        return Promise.resolve({
          results: response?.data?.data?.results || [],
          unseen: 101,
        });
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },

  loadNewNotification: async (
    userId: string,
    fromNotiGroupId: string,
    limit: number,
    streamClient?: StreamClient,
  ) => {
    if (streamClient) {
      const streamOptions: any =
        notificationsDataHelper.getDefaultLoadNotiOptions(userId);
      streamOptions.id_gte = fromNotiGroupId;
      streamOptions.limit = limit;
      streamOptions.offset = 0;

      const data = await makeGetStreamRequest(
        streamClient,
        'notification',
        'u-' + userId,
        'get',
        streamOptions,
      );

      // because getstream not support check user own noti event
      // so this is a trick to hide current user's post event
      const {filteredNotis, userHisOwnNotiCount} =
        notificationsDataHelper.filterCurrentUserNoti(userId, data.results);

      data.results = filteredNotis;
      // update unseen number if there is any noti is hidden
      data.unseen =
        limit - userHisOwnNotiCount > 0 ? limit - userHisOwnNotiCount : 0;

      return data;
    }
    return;
  },

  /**
   * Remove current user's activity from a list of notifications then re-calculate unseen
   * @param userId
   * @param notificationGroups
   * @returns
   */
  filterCurrentUserNoti: (userId: string, notificationGroups: any) => {
    let userHisOwnNotiCount = 0;
    const filteredNotis = notificationGroups.filter((notiGroup: any) => {
      if (notiGroup.verb === 'post') {
        const act = notiGroup.activities[0];
        if (act.actor.id === userId) {
          // if this is user own create post event and it is not seen
          // we must minute unseen count by 1
          // to make unseen number correct after we hide the noti
          if (!notiGroup.is_seen) {
            userHisOwnNotiCount++;
          }
          return false;
        }
      }
      return true;
    });
    return {filteredNotis, userHisOwnNotiCount};
  },

  markAsReadAll: async () => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.putMarkAllAsRead(),
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

  markAsSeenAll: async () => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.putMarkAllAsSeen(),
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

  markAsRead: async (activityId: string) => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.putMarkAsReadById(activityId),
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

export default notificationsDataHelper;
