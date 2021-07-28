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
  online?: boolean;
  role: string;
  selected?: boolean;
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
