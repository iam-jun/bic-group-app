import {messageStatus, roomTypes} from '~/constants/chat';
import {ReactionType} from '~/constants/reactions';
import {IconType} from '~/resources/icons';
import {IFilePicked} from './common';
import {IOwnReaction, IReactionCounts} from './IPost';
export interface IReaction {
  type: ReactionType;
  count: number;
  reacted?: boolean;
}

export interface IMessageMenu {
  label: string;
  icon: IconType;
}

export interface IChatUser {
  _id: string;
  createdAt: Date;
  roles?: string[];
  type: string;
  active: boolean;
  username: string;
  name: string;
  services?: IUserServices;
  emails?: IUserEmail[];
  status?: string;
  statusConnection?: string;
  lastLogin?: Date;
  avatar?: string;
  utcOffset?: number;
  language?: string;
  statusDefault?: string;
  oauth?: {
    authorizedClients: string[];
  };
  _updatedAt?: Date;
  statusLivechat?: string;
  e2e?: {
    private_key: string;
    public_key: string;
  };
  requirePasswordChange?: boolean;
  customFields?: {
    [key: string]: any;
  };
  settings?: IUserSettings;
  selected?: boolean;
  beinUserId: number;
}
interface ILoginToken {
  hashedToken: string;
  twoFactorAuthorizedUntil?: Date;
  twoFactorAuthorizedHash?: string;
}

interface IMeteorLoginToken extends ILoginToken {
  when: Date;
}

interface IPersonalAccessToken extends ILoginToken {
  type: 'personalAccessToken';
  createdAt: Date;
  lastTokenPart: string;
  name?: string;
  bypassTwoFactor?: boolean;
}

interface IUserEmailVerificationToken {
  token: string;
  address: string;
  when: Date;
}

interface IUserEmailCode {
  code: string;
  expire: Date;
}

type LoginToken = ILoginToken & IPersonalAccessToken;

interface IUserServices {
  password?: {
    bcrypt: string;
  };
  email?: {
    verificationTokens?: IUserEmailVerificationToken[];
  };
  resume?: {
    loginTokens?: LoginToken[];
  };
  google?: any;
  facebook?: any;
  github?: any;
  totp?: {
    enabled: boolean;
    hashedBackup: string[];
    secret: string;
  };
  email2fa?: {
    enabled: boolean;
    changedAt: Date;
  };
  emailCode: IUserEmailCode[];
}

interface IUserEmail {
  address: string;
  verified: boolean;
}

interface IUserSettings {
  profile: any;
  preferences: {
    [key: string]: any;
  };
}

export type IAttachment = {
  text?: string;
  timestamp?: string;
  message_link?: string;
  author_name?: string;
  title?: string;
  description?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  title_link?: string;
};

export type IMesssageStatus = typeof messageStatus[keyof typeof messageStatus];

export type IMessage = {
  _id: string;
  room_id: string;
  user: IChatUser;
  text?: string;
  quoted_message?: IMessage;
  reactions?: IReaction[];
  attachments?: IAttachment[];
  _updatedAt: string;
  type?: string;
  localId?: string;
  status?: IMesssageStatus;
  system?: boolean;
  removed?: boolean;
  attachment?: IFilePicked & IAttachment;
  permissions?: [x: string];
  reaction_counts?: IReactionCounts;
  own_reactions?: IOwnReaction;
};

export interface IAttachmentMessage {
  _id: string | number;
  user: IChatUser;
  _updatedAt: string;
  type?: string;
  status?: string;
  attachment: IFilePicked;
}

export type IRoomType = typeof roomTypes[keyof typeof roomTypes];

export type IConversation = {
  _id: string;
  name: string;
  avatar?: string;
  description?: string;
  uids: string[];
  user: IChatUser;
  usernames: string[];
  usersCount: number;
  unreadCount: number;
  unreadCountText?: string;
  lastMessage: string;
  _updatedAt: string;
  type: IRoomType;
  beinGroupId?: number;
};

export interface ISendMessageAction {
  _id: string;
  text: string;
  user: IChatUser;
  room_id: string;
  _updatedAt: string;
}

export interface IUploadFileAction {
  _id: string;
  localId: string;
  user: IChatUser;
  room_id: string;
  _updatedAt: string;
  attachment: IFilePicked;
}

export interface IPayloadReactMessage {
  emoji: string;
  messageId: string;
  shouldReact: boolean;
}
