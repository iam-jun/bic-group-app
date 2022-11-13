import { IUserWorkExperience } from '~/interfaces/IAuth';

export const mapWorkExperience = (
  data: any[],
): IUserWorkExperience[] => (data || []).map((item: any) => mapWorkExp(item));

export const mapWorkExp = (data: any): IUserWorkExperience => ({
  ...data,
  titlePosition: data?.titlePosition || '',
  currentlyWorkHere: data?.currentlyWorkHere,
  startDate: data?.startDate || null,
  endDate: data?.endDate || null,
});
