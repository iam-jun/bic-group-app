export interface IPaginationParams {
  offset: number;
  count: number;
  sort?: {[x: string]: string | number};
}

export interface ICreateRoomReq {
  name: string;
  members: string[];
  extraData: {
    topic: string;
  };
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
  roomId: string;
  /*
    The message's id to create a thread.
    */
  channel: string;
  /*
    This will cause the message's name to appear as the given alias, 
    but your username will still display.
  */
  alias?: string;
  text?: string;
  emoji?: string;
  /*
    If provided, this will make the avatar use the provided image url.
  */
  avatar?: string;
}

export interface IGetGroupRolesReq {
  roomId: string;
}
