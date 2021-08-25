export interface IPaginationParams {
  offset: number;
  count: number;
  sort?: {[x: string]: string | number};
}

export interface ICreateRoomReq {
  name: string;
  members: string[];
  customFields?: {
    type: string;
    beinGroupId?: string;
    [x: string]: any;
  };
  readOnly?: boolean;
}

export interface IUpdateRoomTopicReq {
  roomId: string;
  topic: string;
}

export interface ISendMessageReq {
  message: {
    rid: string;
    _id: string;

    /*
    This will cause the message's name to appear as the given alias, 
    but your username will still display.
  */
    alias?: string;
    msg?: string;
    emoji?: string;
    /*
    If provided, this will make the avatar use the provided image url.
  */
    avatar?: string;
  };
}

export interface IGetGroupRolesReq {
  roomId: string;
}

export interface IGetGroupReq {
  roomId: string;
}

export interface IReadSubscription {
  rid: string;
}

export interface IUpdateGroupName {
  roomId: string;
  name: string;
}

export interface IRemoveMemberReq {
  roomId: string;
  userId: string;
}
export interface IGetMentionUsersReq {
  query: any;
}
