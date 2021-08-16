import {languages} from '~/configs';
import {IconType} from '~/resources/icons';
import {StreamClient} from 'getstream';
import {FlashMessageProps} from '~/beinComponents/FlashMessage';

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

export interface IHeaderFlashMessage {
  content: string;
  props: FlashMessageProps;
  duration?: number;
}
