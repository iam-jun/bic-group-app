import ApiConfig, { HttpApiRequestConfig } from '~/configs/apiConfig';
import { IUserEdit } from '~/interfaces/IAuth';
import { IAddWorkExperienceReq } from '~/interfaces/IWorkExperienceRequest';
import { makeHttpRequest } from '~/services/httpApiRequest';

export const menuApiConfig = {
  getUserProfile: (userId: number, params?: any): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/profile`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  editMyProfile: (userId: number, data: IUserEdit): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/profile`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    data: {
      ...data,
    },
  }),
  getMyWorkExperience: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  addWorkExperience: (data: IAddWorkExperienceReq): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data,
  }),
  editWorkExperience: (
    id: number,
    data: IAddWorkExperienceReq,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience/${id}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data,
  }),
  deleteWorkExperience: (id: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience/${id}`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  // get others work experience data
  getWorkExperience: (id: number): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${id}/work-experience`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
  }),
  logout: (): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}auth/logout`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
};

const menuDataHelper = {
  getUserProfile: async (userId: number, params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getUserProfile(userId, params),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  editMyProfile: async (params: any) => {
    try {
      const { userId, data } = params;

      const response: any = await makeHttpRequest(
        menuApiConfig.editMyProfile(userId, data),
      );

      if (response && response?.data) {
        return Promise.resolve(response.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getMyWorkExperience: async () => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getMyWorkExperience(),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  addWorkExperience: async (data: IAddWorkExperienceReq) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.addWorkExperience(data),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  editWorkExperience: async (id: number, data: IAddWorkExperienceReq) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.editWorkExperience(id, data),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteWorkExperience: async (id: number) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.deleteWorkExperience(id),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getWorkExperience: async (id: number) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getWorkExperience(id),
      );
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  logout: async () => {
    try {
      const response: any = await makeHttpRequest(menuApiConfig.logout());
      if (response && response?.data) {
        return Promise.resolve(response?.data);
      }
      return Promise.reject(response);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default menuDataHelper;
