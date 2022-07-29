import ApiConfig, { HttpApiRequestConfig } from '~/configs/apiConfig';
import { IUserEdit } from '~/interfaces/IAuth';
import { IAddWorkExperienceReq } from '~/interfaces/IWorkExperienceRequest';
import { withHttpRequestPromise } from '~/services/httpApiRequest';

export const menuApiConfig = {
  getUserProfile: (
    userId: string, params?: any,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/${userId}/profile`,
    method: 'get',
    provider: ApiConfig.providers.bein,
    useRetry: true,
    params,
  }),
  editMyProfile: (
    userId: string, data: IUserEdit,
  ): HttpApiRequestConfig => ({
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
    id: string,
    data: IAddWorkExperienceReq,
  ): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience/${id}`,
    method: 'put',
    provider: ApiConfig.providers.bein,
    useRetry: false,
    data,
  }),
  deleteWorkExperience: (id: string): HttpApiRequestConfig => ({
    url: `${ApiConfig.providers.bein.url}users/work-experience/${id}`,
    method: 'delete',
    provider: ApiConfig.providers.bein,
    useRetry: false,
  }),
  // get others work experience data
  getWorkExperience: (id: string): HttpApiRequestConfig => ({
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
  getUserProfile: (userId: string, params?: any) => withHttpRequestPromise(
    menuApiConfig.getUserProfile, userId, params,
  ),
  editMyProfile: (params: any) => {
    const { userId, data } = params || {}
    return withHttpRequestPromise(menuApiConfig.editMyProfile, userId, data)
  },
  getMyWorkExperience: () => withHttpRequestPromise(menuApiConfig.getMyWorkExperience),
  addWorkExperience: (data: IAddWorkExperienceReq) => withHttpRequestPromise(
    menuApiConfig.addWorkExperience, data,
  ),
  editWorkExperience: (id: string, data: IAddWorkExperienceReq) => withHttpRequestPromise(
    menuApiConfig.editWorkExperience, id, data,
  ),
  deleteWorkExperience: (id: string) => withHttpRequestPromise(menuApiConfig.deleteWorkExperience, id),
  getWorkExperience: (id: string) => withHttpRequestPromise(menuApiConfig.getWorkExperience, id),
};

export default menuDataHelper;
