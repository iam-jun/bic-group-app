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
    isRootGroup: boolean;
}

export enum IInvitationsStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export interface IInvitation {
  id: string,
  inviter: IInviter,
  invitee: IInviter,
  targetType: string;
  targetInfo: ITargetInfo;
  status: IInvitationsStatus;
  createdAt: string;
  updatedAt: string;
  communityId: string;
}
