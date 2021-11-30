import {IUploadType} from '~/configs/resourceConfig';
import {messageStatus, roomTypes} from '~/constants/chat';
import {ReactionType} from '~/constants/reactions';
import {IconType} from '~/resources/icons';
import {IFilePicked, IObject} from './common';
import {IActivityDataImage, IOwnReaction, IReactionCounts} from './IPost';
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
  fullname?: string;
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
  localId?: string;
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

export interface IQuotedMessage {
  msgId: string;
  author: string;
}

export type IMessage = {
  _id: string;
  room_id: string;
  user: IChatUser;
  text?: string;
  quotedMessage?: IQuotedMessage;
  reactions?: IReaction[];
  attachments?: IAttachment[];
  _updatedAt?: string;
  type?: string;
  localId?: string;
  status?: IMesssageStatus;
  system?: boolean;
  removed?: boolean;
  attachment?: IFilePicked & IAttachment;
  permissions?: [x: string];
  reaction_counts?: IReactionCounts;
  own_reactions?: IOwnReaction;
  editedAt?: any;
  editedBy?: any;
  createdAt: string;
  msg?: string;
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
  lastMessage: IMessage;
  _updatedAt: string;
  type: IRoomType;
  beinGroupId?: number;
  disableNotifications?: boolean;
};

export type IConversationInfo = {
  _id: string;
  name?: string;
  description?: string;
  avatar?: string;
  cover?: string;
};

export interface ISendMessageAction {
  _id: string;
  text: string;
  user: IChatUser;
  room_id: string;
  createdAt: string;
  replyingMessage?: IMessage;
  image?: IActivityDataImage;
  status?: string;
}

export interface IUploadQuickChatImage {
  roomId: string;
  fieldName: 'icon' | 'background_img_url';
  file: IFilePicked;
  uploadType: IUploadType;
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

export interface IPayloadGetAttachmentFiles {
  roomId: string;
  isDirectMessage: boolean;
  offset?: number;
  count?: number;
  sort?: any;
  query?: any;
  fields?: any;
}

export interface IUpdateConversationDetail {
  name?: string;
  description?: string | null;
  avatar?: string;
  cover?: string;
}

export interface IMessagesData {
  loading: boolean;
  loadingNext: boolean;
  data: string[]; // just store id
  extra: string[]; // just store id
  items: IObject<IMessage>; // message item
  canLoadMore: boolean;
  canLoadNext: boolean;
  error: any;
}

export interface IChatEvent {
  type: string;
  payload?: any;
}
