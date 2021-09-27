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

export interface IFilePicked {
  name: string;
  filename: string;
  type: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  //app
  uri: string;
  //web
  base64?: string;
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

export interface IPayloadShowModal {
  isOpen: boolean;
  ContentComponent: any;
}
