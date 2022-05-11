import {IObject} from '~/interfaces/common';
import {IUser} from '~/interfaces/IAuth';

export const mapData = (data: any) => {
  return mapUsers(data);
};

export const mapUsers = (data?: []): IUser[] =>
  (data || []).map((item: any) => mapUser(item));

export const mapUser = (item: any): IUser => ({
  ...item,
  avatar: item.avatar,
  name: item?.fullname || item?.name || item?.username,
});

export const mapItems = (data?: []): IObject<any> => {
  //@ts-ignore
  return (data || []).reduce((obj, item) => ((obj[item.id] = item), obj), {});
};
