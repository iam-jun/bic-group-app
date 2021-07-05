import {IUser} from './IAuth';

export interface IGroup {
  user: IUser;
  updatedAt: string;
  newPostCount: number;
  isPinned?: boolean;
}
