import { IUserProfile, IUserWorkExperience } from '~/interfaces/IAuth';

export const mapProfile = (data: any): IUserProfile => ({ ...data, language: data?.language || [] });

export const mapWorkExperience = (data: []): IUserWorkExperience[] => (data || []).map((item: any) => mapWorkExp(item));

export const mapWorkExp = (data: any): IUserWorkExperience => ({
  ...data,
  titlePosition: data?.titlePosition || '',
  currentlyWorkHere: data?.currentlyWorkHere,
  startDate: data?.startDate || null,
  endDate: data?.endDate || null,
});
