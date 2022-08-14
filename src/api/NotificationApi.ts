import { Method } from 'axios';
import { makeHttpRequest, withHttpRequestPromise } from '~/api/apiRequest';
import ApiConfig, { HttpApiRequestConfig } from '~/api/apiConfig';
import { IParamGetNotifications } from '~/interfaces/INotification';

const LIMIT = 20;

const provider = ApiConfig.providers.beinNotification;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
}

export const notificationApiConfig = {
  getNotifications: (params: IParamGetNotifications): HttpApiRequestConfig => {
    const { limit, ...restParams } = params || {};
    return {
      ...defaultConfig,
      url: `${provider.url}notifications`,
      params: {
        limit: limit || LIMIT,
        ...restParams,
      },
    };
  },
  putMarkAsReadById: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/${id}/mark-read`,
    method: 'put',
  }),
  putMarkAllAsRead: (flag: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/mark-read/${flag}`,
    method: 'put',
  }),
  putMarkAllAsSeen: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/mark-seen`,
    method: 'put',
  }),
  putMarkAsUnReadById: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/${id}/mark-unread`,
    method: 'put',
  }),
};

const notificationApi = {
  getNotificationList: async (param: IParamGetNotifications) => {
    try {
      const response: any = await makeHttpRequest(notificationApiConfig.getNotifications(param));
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
  markAsReadAll: (flag: string) => withHttpRequestPromise(notificationApiConfig.putMarkAllAsRead, flag),
  markAsSeenAll: () => withHttpRequestPromise(notificationApiConfig.putMarkAllAsSeen),
  markAsRead: (activityId: string) => withHttpRequestPromise(notificationApiConfig.putMarkAsReadById, activityId),
  markAsUnRead: (activityId: string) => withHttpRequestPromise(
    notificationApiConfig.putMarkAsUnReadById, activityId,
  ),
};

export default notificationApi;
