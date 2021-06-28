import {IUser} from '../auth/interfaces';

export type IComment = {
  id: string;
  content: string;
  createdAt: string;
  updateAt: string;
  user: IUser;
  replyCount: number;
};
