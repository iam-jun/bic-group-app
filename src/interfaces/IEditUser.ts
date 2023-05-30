import { ResourceUploadType } from './IUpload';
import { IFilePicked } from './common';
import { ILanguageResponseItem } from './IAuth';

export enum GENDER_TYPE {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum RELATIONSHIP_TYPE {
  SINGLE = 'SINGLE',
  IN_A_RELATIONSHIP = 'IN_A_RELATIONSHIP',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
}

export interface IUserImageUpload {
  id: string;
  fieldName: 'avatar' | 'backgroundImgUrl';
  file: IFilePicked;
  uploadType: ResourceUploadType;
}

export interface IGenderItem {
  type: GENDER_TYPE;
  title: string;
}

export interface ILanguageItem extends ILanguageResponseItem {
  selected?: boolean;
}

export interface IRelationshipItem {
  type: RELATIONSHIP_TYPE;
  title: string;
}

export interface IOptionItem {
  type: string;
  title: string;
}

export interface IUserBadge {
  id: string;
  name: string;
  iconUrl: string;
}

export interface ICommunityBadges{
  id: string;
  name: string;
  icon?: string;
  badges: IUserBadge[];
}
