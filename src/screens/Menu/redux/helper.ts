import {IUserProfile} from '~/interfaces/IAuth';

export const mapProfile = (data: any): IUserProfile => {
  return {...data, language: data?.language || []};
};
