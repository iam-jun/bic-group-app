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

export interface IFileResponse {
  name?: string;
  uri: string;
  size: number;
  type: string;
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
