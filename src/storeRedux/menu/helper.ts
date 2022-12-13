import { IUserProfile } from '~/interfaces/IAuth';

export const mapProfile = (data: any): IUserProfile => ({ ...data, language: data?.language || [] });
