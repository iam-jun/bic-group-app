import {ISignUpResult} from 'amazon-cognito-identity-js';
import {User} from 'react-native-gifted-chat';
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
  cognito_uuid?: string;
  stream_uuid?: string;
  fullname: string;
  gender?: string;
  birthday?: string;
  bein_staff_role?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  background_img_url?: string;
  phone?: string;
  address?: string;
  language?: string;
  description?: string;
}
