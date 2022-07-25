import { IUserProfile, IUserWorkExperience } from '~/interfaces/IAuth';

export const mapProfile = (data: any): IUserProfile => ({ ...data, language: data?.language || [] });

export const mapWorkExperience = (data: []): IUserWorkExperience[] => (data || []).map((item: any) => mapWorkExp(item));

export const mapWorkExp = (data: any): IUserWorkExperience => ({
  ...data,
  titlePosition: data?.title_position || '',
  currentlyWorkHere: data?.currently_work_here,
  startDate: data?.start_date || null,
  endDate: data?.end_date || null,
});
