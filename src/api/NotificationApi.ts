import { Method } from 'axios';
import { makeHttpRequest, withHttpRequestPromise } from '~/api/apiRequest';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
import { IEditNotificationSetting, IParamGetNotifications, IParamUpdateSpecificNotificationSettings } from '~/interfaces/INotification';
import { IGetCommunityGroup } from '~/interfaces/IGroup';

const LIMIT = 20;

const provider = apiProviders.beinNotification;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const notificationApiConfig = {
  pushToken: (
    deviceToken: string, deviceId: string,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}device-tokens`,
    method: 'post',
    data: {
      token: deviceToken,
      deviceId,
    },
  }),
  removePushToken: (deviceId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}device-tokens/${deviceId}`,
    method: 'delete',
    useRetry: false,
    timeout: 5000,
  }),
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
  getChangelogNotification: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/${id}?type=changelogs`,
  }),
  getConfigSettings: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings`,
  }),
  updateSettings: (params: IEditNotificationSetting): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings`,
    method: 'patch',
    data: params,
  }),
  getCommunitySettings: (communityId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/${communityId}`,
  }),
  getGroupSettings: (communityId: string, groupIds: string[]): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/${communityId}`,
    method: 'post',
    data: { groupIds },
  }),
  updateCommunitySettings: (communityId: string, params: IEditNotificationSetting): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/${communityId}`,
    method: 'patch',
    data: params,
  }),
  updateGroupSettings: (
    communityId: string,
    groupId: string,
    params: IEditNotificationSetting,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/${communityId}/${groupId}`,
    method: 'patch',
    data: params,
  }),
  deleteNotification: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}notifications/${id}`,
    method: 'delete',
  }),
  getGroupsAndGroupsSettings: (communityId: string, otherParams: IGetCommunityGroup): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/${communityId}/groups`,
    params: {
      ...otherParams,
      key: otherParams?.key?.trim?.() ? otherParams.key : undefined,
    },
  }),
  generateAdvancedSettings: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/advanced/generate`,
  }),
  getSpecificNotificationSettings: (targetId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/specific/${targetId}`,
  }),
  editSpecificNotificationSettings: (targetId: string,
    data: IParamUpdateSpecificNotificationSettings): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}settings/specific/${targetId}`,
    method: 'put',
    data,
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
  getChangelogNotification: (id: string) => withHttpRequestPromise(notificationApiConfig.getChangelogNotification, id),
  getConfigSettings: () => withHttpRequestPromise(notificationApiConfig.getConfigSettings),
  updateSettings: (params: IEditNotificationSetting) => withHttpRequestPromise(
    notificationApiConfig.updateSettings, params,
  ),
  getCommunitySettings: (communityId: string) => withHttpRequestPromise(
    notificationApiConfig.getCommunitySettings, communityId,
  ),
  getGroupSettings: (communityId: string, groupIds: string[]) => withHttpRequestPromise(
    notificationApiConfig.getGroupSettings, communityId, groupIds,
  ),
  updateCommunitySettings: (communityId: string, params: IEditNotificationSetting) => withHttpRequestPromise(
    notificationApiConfig.updateCommunitySettings, communityId, params,
  ),
  updateGroupSettings: (
    communityId: string,
    groupId: string,
    params: IEditNotificationSetting,
  ) => withHttpRequestPromise(
    notificationApiConfig.updateGroupSettings, communityId, groupId, params,
  ),
  deleteNotification: (id: string) => withHttpRequestPromise(notificationApiConfig.deleteNotification, id),
  getGroupsAndGroupsSettings: (communityId: string, params: IGetCommunityGroup) => withHttpRequestPromise(
    notificationApiConfig.getGroupsAndGroupsSettings, communityId, params,
  ),
  generateAdvancedSettings: () => withHttpRequestPromise(notificationApiConfig.generateAdvancedSettings),
  getSpecificNotificationSettings: (targetId: string) => withHttpRequestPromise(
    notificationApiConfig.getSpecificNotificationSettings, targetId,
  ),
  editSpecificNotificationSettings: (
    targetId: string,
    data: IParamUpdateSpecificNotificationSettings,
  ) => withHttpRequestPromise(
    notificationApiConfig.editSpecificNotificationSettings, targetId, data,
  ),
};

export default notificationApi;
