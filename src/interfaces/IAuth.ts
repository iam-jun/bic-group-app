import {ISignUpResult} from 'amazon-cognito-identity-js';
import {GENDER_TYPE, RELATIONSHIP_TYPE} from './IEditUser';

// Actiontype
export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp {
  username: string;
  email: string;
  password: string;
}

export interface IForgotPasswordConfirm {
  code: string;
  email: string;
  password: string;
}

export interface ICognitoError {
  code: string;
  name: string;
  message: string;
}

export interface IUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  role: string;
  selected?: boolean;
  status?: string;
}

export interface IUserResponse extends IUser {
  username: string;
  signInUserSession?: any;
  attributes?: any;
  name: string; //merge from attributes
  email: string; //merge from attributes
}

export interface IForgotPasswordError {
  errBox?: string;
  errRequest?: string;
  errConfirm?: string;
}

export interface IChangePasswordError {
  errCurrentPassword?: string;
  errBox?: string;
}

export type ISignUpResponse = ISignUpResult;

export interface IUserProfile {
  id: string;
  email?: string;
  fullname?: string;
  username?: string;
  cognito_uuid?: string;
  stream_uuid?: string;
  gender?: string;
  birthday?: string;
  bein_staff_role?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  avatar?: string;
  background_img_url?: string;
  phone?: string;
  country_code?: string;
  address?: string;
  language?: string[];
  description?: string;
  relationship_status?: string;
  city?: string;
  country?: string;
  latest_work?: {
    company?: string;
    title_position?: string;
  };
}

export interface IGetUserProfile {
  userId: string;
  params?: any;
}

export interface IUserEdit {
  id?: string;
  email?: string;
  fullname?: string;
  gender?: GENDER_TYPE;
  birthday?: string;
  avatar?: string;
  background_img_url?: string;
  phone?: string;
  country_code?: string;
  address?: string;
  language?: string[];
  description?: string;
  relationship_status?: RELATIONSHIP_TYPE;
  city?: string;
  country?: string;
}
export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  global: boolean;
}

export interface IUserWorkExperience {
  id: string;
  company: string;
  titlePosition: string;
  location?: string;
  description?: string;
  currentlyWorkHere?: boolean;
  startDate?: string;
  endDate?: string | null;
}

export interface IUserAddWorkExperience {
  company: string;
  titlePosition: string;
  location?: string;
  description?: string;
  currentlyWorkHere?: boolean;
  startDate?: string;
  endDate?: string | null;
}
