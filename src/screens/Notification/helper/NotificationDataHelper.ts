import { makeHttpRequest } from '~/services/httpApiRequest';
import ApiConfig, { HttpApiRequestConfig } from '~/configs/apiConfig';
import { IParamGetNotifications } from '~/interfaces/INotification';

const LIMIT = 20;

export const notificationApiConfig = {
  getNotifications: (params: IParamGetNotifications): HttpApiRequestConfig => {
    const { limit, ...restParams } = params || {};
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
  putMarkAsReadById: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinNotification.url}notifications/${id}/mark-read`,
    method: 'put',
    provider: ApiConfig.providers.beinNotification,
    useRetry: true,
  }),
  putMarkAllAsRead: (flag: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinNotification.url}notifications/mark-read/${flag}`,
    method: 'put',
    provider: ApiConfig.providers.beinNotification,
    useRetry: true,
  }),
  putMarkAllAsSeen: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinNotification.url}notifications/mark-seen`,
    method: 'put',
    provider: ApiConfig.providers.beinNotification,
    useRetry: true,
  }),
  putMarkAsUnReadById: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.beinNotification.url}notifications/${id}/mark-unread`,
    method: 'put',
    provider: ApiConfig.providers.beinNotification,
    useRetry: true,
  }),
};

const notificationsDataHelper = {
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
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  markAsReadAll: async (flag: string) => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.putMarkAllAsRead(flag),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
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
      }
      return Promise.reject(response);
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
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  markAsUnRead: async (activityId: string) => {
    try {
      const response: any = await makeHttpRequest(
        notificationApiConfig.putMarkAsUnReadById(activityId),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default notificationsDataHelper;
