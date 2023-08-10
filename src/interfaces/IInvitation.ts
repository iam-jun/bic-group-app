export interface IInviter {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
  isDeactivated: boolean;
}

export interface ITargetInfo {
    id: string;
    name: string;
}

export interface IInvitation {
  id: string,
  inviter: IInviter,
  invitee: IInviter,
  targetType: string;
  targetInfo: ITargetInfo;
  status: string;
  createdAt: string;
  updatedAt: string;
}
