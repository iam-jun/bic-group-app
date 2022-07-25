import {languages} from '~/configs';
import {IconType} from '~/resources/icons';
import {ToastMessageProps} from '~/beinComponents/ToastMessage/NormalToastMessage';
import {BaseBottomSheetProps} from '~/beinComponents/BottomSheet/BaseBottomSheet';

export interface IObject<T> {
  [key: string | number]: T;
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
  uri: string;
  [x: string]: any;
}

export interface IGiphy {
  id: string;
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
  toastType?: 'simple' | 'normal' | 'banner';
}

export interface IPayloadShowModal {
  isOpen: boolean;
  ContentComponent: any;
  props?: BaseBottomSheetProps | any;
  useAppBottomSheet?: boolean;
  appModalStyle?: any;
  closeOutSide?: boolean;
}

export interface IUserPreview {
  isOpen?: boolean;
  userId?: string;
  params?: IObject<any>;
  position?: {x: number; y: number};
}

export interface ILinkPreview {
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  domain?: string;
}

export interface ICountryCodeList {
  code: string;
  name: string;
  flag: IconType;
}

export interface ILocation {
  name: string;
  type: string;
  name_with_type: string;
  country: string;
}
