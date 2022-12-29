import { languages } from '~/configs';
import { IconType } from '~/resources/icons';
import { BaseToastProps } from '~/baseComponents/Toast/BaseToast';
import { BaseBottomSheetProps } from '~/baseComponents/BottomSheet/BaseBottomSheet';
import { HeaderProps } from '~/beinComponents/Header';

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

export interface IFilePicked {
  name: string;
  filename: string;
  type: string;
  mime?: string;
  size: number;
  width?: number;
  height?: number;
  uri: string;
  [x: string]: any;
}

export interface IResponseData {
  code: number;
  data: any;
  meta: any;
}

export interface IToastMessage extends BaseToastProps {
  duration?: number;
}

export interface IPayloadShowModal {
  isOpen: boolean;
  isFullScreen?: boolean;
  titleFullScreen?: string;
  headerFullScreenProps?: HeaderProps;
  ContentComponent: any;
  props?: BaseBottomSheetProps | any;
  useAppBottomSheet?: boolean;
  closeOutSide?: boolean;
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

export interface ISearchReq {
  limit: number,
  offset: number,
  key?: string,
}

export enum SortOder {
  ASC = 'ASC',
  DESC = 'DESC'
}
