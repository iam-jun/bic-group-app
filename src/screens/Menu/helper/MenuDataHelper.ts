import ApiConfig, {HttpApiRequestConfig} from '~/configs/apiConfig';
import {IUserEdit} from '~/interfaces/IAuth';
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
  uploadImage: (data: FormData): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}files/upload-photos`,
    method: 'post',
    provider: ApiConfig.providers.bein,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
  uploadImage: async (data: FormData) => {
    try {
      const response: any = await makeHttpRequest(
        menuApiConfig.uploadImage(data),
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
