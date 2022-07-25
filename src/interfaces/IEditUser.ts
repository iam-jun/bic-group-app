import {IUploadType} from '~/configs/resourceConfig';
import {IFilePicked} from './common';

export type GENDER_TYPE = 'MALE' | 'FEMALE' | 'OTHERS';
export type RELATIONSHIP_TYPE =
  | 'SINGLE'
  | 'IN_A_RELATIONSHIP'
  | 'ENGAGED'
  | 'MARRIED';

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
