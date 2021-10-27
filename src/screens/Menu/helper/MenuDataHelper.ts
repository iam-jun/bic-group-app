import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IUserEdit} from '~/interfaces/IAuth';
import {IAddWorkExperienceReq} from '~/interfaces/IWorkExperienceRequest';
import {makeHttpRequest} from '~/services/httpApiRequest';

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
  getWorkExperience: (): HttpApiRequestConfig => ({
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
};

const menuDataHelper = {
  getUserProfile: async (userId: number, params?: any) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getUserProfile(userId, params),
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
  editMyProfile: async (userId: number, data: IUserEdit) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.editMyProfile(userId, data),
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
  getWorkExperience: async () => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.getWorkExperience(),
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
  addWorkExperience: async (data: IAddWorkExperienceReq) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.addWorkExperience(data),
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
  editWorkExperience: async (id: number, data: IAddWorkExperienceReq) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.editWorkExperience(id, data),
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

export default menuDataHelper;
