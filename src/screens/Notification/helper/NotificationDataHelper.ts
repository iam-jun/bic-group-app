import {makeHttpRequest} from '~/services/httpApiRequest';
import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IParamGetNotifications} from '~/interfaces/INotification';

const LIMIT = 20;

export const notificationApiConfig = {
  getNotifications: (params: IParamGetNotifications): HttpApiRequestConfig => {
    const {limit, ...restParams} = params || {};
    return {
      url: `${ApiConfig.providers.beinNotification.url}notifications`,
      method: 'get',
      provider: ApiConfig.providers.beinNotification,
      useRetry: true,
      params: {
        limit: limit || LIMIT,
        ...restParams,
      },
    };
  },
  putMarkAsReadById: (id: string): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinNotification.url}notifications/${id}/mark-read`,
      method: 'put',
      provider: ApiConfig.providers.beinNotification,
      useRetry: true,
    };
  },
  putMarkAllAsRead: (): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinNotification.url}notifications/mark-read`,
      method: 'put',
      provider: ApiConfig.providers.beinNotification,
      useRetry: true,
    };
  },
  putMarkAllAsSeen: (): HttpApiRequestConfig => {
    return {
      url: `${ApiConfig.providers.beinNotification.url}notifications/mark-seen`,
      method: 'put',
      provider: ApiConfig.providers.beinNotification,
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
          results: response?.data?.data?.list || [],
          unseen: response?.data?.meta?.unSeen,
        });
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },

  loadNewNotification: async (fromNotiGroupId: string, limit: number) => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.getNotifications({
          limit,
          id_gte: fromNotiGroupId,
        }),
      );
      if (response && response?.data?.data) {
        return Promise.resolve({
          results: response?.data?.data || [],
          unseen: response?.data?.meta?.unSeen,
        });
      } else {
        return Promise.reject(response);
      }
    } catch (e) {
      return Promise.reject(e);
    }
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
          if (!notiGroup.isSeen) {
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
