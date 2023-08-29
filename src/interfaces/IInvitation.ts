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
    communityName: string;
}

export enum IInvitationsStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export enum IInvitationsTargetType {
  GROUP = 'GROUP',
  GROUP_SET = 'GROUP_SET',
}

export interface IInvitation {
  id: string,
  inviter: IInviter,
  invitee: IInviter,
  targetType: IInvitationsTargetType;
  targetInfo: ITargetInfo;
  status: IInvitationsStatus;
  createdAt: string;
  updatedAt: string;
  communityId: string;
}
