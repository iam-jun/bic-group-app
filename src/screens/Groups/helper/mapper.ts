import {IObject} from '~/interfaces/common';
import {IUser} from '~/interfaces/IAuth';
import {IJoiningMember} from '~/interfaces/IGroup';

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

export const mapRequestMembers = (data?: []): IObject<IJoiningMember> => {
  //@ts-ignore
  return (data || []).reduce((obj, item) => ((obj[item.id] = item), obj), {});
};
