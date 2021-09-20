import {languages} from '~/configs';
import {IconType} from '~/resources/icons';
import {StreamClient} from 'getstream';
import {ToastMessageProps} from '~/beinComponents/ToastMessage/NormalToastMessage';

export interface IObject<T> {
  [key: string]: T;
}

export interface ILanguage {
  code: keyof typeof languages;
  title: string;
  icon: IconType;
}

export interface ISetting {
  type: string;
  title: string;
  icon: IconType;
}

export interface IGetStreamDispatch {
  streamClient: StreamClient;
  userId: string;
}

export interface IRightMenu {
  type: string;
  title: string;
}

export type IUploadType =
  | 'userAvatar'
  | 'userCover'
  | 'groupAvatar'
  | 'groupCover'
  | 'postImage'
  | 'postVideo'
  | 'postFile'
  | 'chatImage'
  | 'chatVideo'
  | 'chatFile';

export interface IFilePicked {
  name: string;
  filename: string;
  type: string;
  mime: string;
  size: number;
  uri: string; //app
  [x: string]: any;
}

export interface IResponseData {
  code: number;
  data: any;
  meta: any;
}

export interface IToastMessage {
  content: string;
  props: ToastMessageProps;
  duration?: number;
}
