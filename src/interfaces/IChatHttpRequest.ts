export interface IPaginationParams {
  offset: number;
  count: number;
  sort?: {[x: string]: string | number};
}

export interface ICreateDiretChatReq {
  username: string;
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
    attachments?: any;
  };
}

export interface IEditMessageReq {
  roomId: string;
  msgId: string;
  text: string;
}

export interface IDeleteMessage {
  roomId: string;
  msgId: string;
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
  fields: any;
  query: any;
}

export interface IAddUsersToGroupReq {
  user_ids: number[];
}

export interface IGetReactionStatisticsReq {
  message_id: string;
  reaction_name: string;
}
export interface IGetMessageReq {
  msgId: string;
}

export interface IGetSurroundingMessages {
  message_id: string;
  room_id: string;
  count: number;
}
