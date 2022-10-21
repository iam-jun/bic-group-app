import { IUploadType } from '~/configs/resourceConfig';
import { IFilePicked } from './common';

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
  uploadType: IUploadType;
}

export interface IGenderItem {
  type: GENDER_TYPE;
  title: string;
}

export interface ILanguageItem {
  code: string;
  fullName: string;
  name: string;
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
