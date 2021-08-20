import {ISignUpResult} from 'amazon-cognito-identity-js';
import {User} from 'react-native-gifted-chat';
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

export interface IUser extends User {
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
  address?: string;
  language?: string[];
  description?: string;
  relationship_status?: string;
  isPublic?: boolean;
}

export interface IUserEdit {
  id?: number;
  email?: string;
  fullname?: string;
  gender?: GENDER_TYPE;
  birthday?: string;
  avatar?: string;
  background_img_url?: string;
  phone?: string;
  address?: string;
  language?: string[];
  description?: string;
  relationship_status?: RELATIONSHIP_TYPE;
}
export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  global: boolean;
}
