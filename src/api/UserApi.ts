import { Method } from 'axios';
import { HttpApiRequestConfig, apiProviders } from './apiConfig';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import { IParamsSignUp, IUserEdit, IVerifyEmail } from '~/interfaces/IAuth';
import { IAddWorkExperienceReq } from '~/interfaces/IWorkExperienceRequest';
import { IParamSearchMentionAudiences } from '~/interfaces/IPost';
import { withHttpRequestPromise } from './apiRequest';

const provider = apiProviders.beinUser;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const userApiConfig = {
  getUsers: (params: IParamsGetUsers): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users`,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
  getUserProfile: (userId: string, params?: any): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/profile`,
    params,
  }),
  editMyProfile: (data: IUserEdit): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/profile`,
    method: 'put',
    data: {
      ...data,
    },
  }),
  getMyWorkExperience: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience`,
  }),
  addWorkExperience: (data: IAddWorkExperienceReq): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience`,
    method: 'post',
    useRetry: false,
    data,
  }),
  editWorkExperience: (
    id: string,
    data: IAddWorkExperienceReq,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience/${id}`,
    method: 'put',
    useRetry: false,
    data,
  }),
  deleteWorkExperience: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/work-experience/${id}`,
    method: 'delete',
    useRetry: false,
  }),
  // get others work experience data
  getWorkExperience: (id: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${id}/work-experience`,
  }),
  getListBlockingUsers: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/blockings`,
  }),
  getListRelationship: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}me/blocking-relationships`,
  }),
  blockUser: (blockedUserId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${blockedUserId}/block`,
    method: 'post',
  }),
  unblockUser: (userId: string): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/${userId}/unblock`,
    method: 'post',
  }),
  resendVerificationEmail: (params: IVerifyEmail): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}auth/resend-confirmation-code?email=${params.email}&redirect_page=${params.redirectPage}`,
    method: 'post',
  }),
  getSearchMentionAudiences: (
    params: IParamSearchMentionAudiences,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}users/mentionable`,
    params: {
      ...params,
      key: params.key ? params.key : undefined,
    },
  }),
  signUp: (params: IParamsSignUp): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}auth/signup/referral`,
    method: 'post',
    data: { ...params },
  }),
};

const userApi = {
  getUsers: async (params: IParamsGetUsers) => withHttpRequestPromise(
    userApiConfig.getUsers, params,
  ),
  getUserProfile: (userId: string, params?: any) => withHttpRequestPromise(
    userApiConfig.getUserProfile, userId, params,
  ),
  editMyProfile: (data: IUserEdit) => withHttpRequestPromise(userApiConfig.editMyProfile, data),
  getMyWorkExperience: () => withHttpRequestPromise(userApiConfig.getMyWorkExperience),
  addWorkExperience: (data: IAddWorkExperienceReq) => withHttpRequestPromise(
    userApiConfig.addWorkExperience, data,
  ),
  editWorkExperience: (id: string, data: IAddWorkExperienceReq) => withHttpRequestPromise(
    userApiConfig.editWorkExperience, id, data,
  ),
  deleteWorkExperience: (id: string) => withHttpRequestPromise(
    userApiConfig.deleteWorkExperience, id,
  ),
  getWorkExperience: (id: string) => withHttpRequestPromise(
    userApiConfig.getWorkExperience, id,
  ),
  blockUser: (blockedUserId: string) => withHttpRequestPromise(userApiConfig.blockUser, blockedUserId),
  unblockUser: (userId: string) => withHttpRequestPromise(userApiConfig.unblockUser, userId),
  getListBlockingUsers: () => withHttpRequestPromise(userApiConfig.getListBlockingUsers),
  getListRelationship: () => withHttpRequestPromise(userApiConfig.getListRelationship),
  resendVerificationEmail: (params: IVerifyEmail) => withHttpRequestPromise(
    userApiConfig.resendVerificationEmail, params,
  ),
  getSearchMentionAudiences: (params: IParamSearchMentionAudiences) => withHttpRequestPromise(
    userApiConfig.getSearchMentionAudiences, params,
  ),
  signUp: (params: IParamsSignUp) => withHttpRequestPromise(userApiConfig.signUp, params),
};

export default userApi;
