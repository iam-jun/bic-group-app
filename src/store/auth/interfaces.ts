import {CognitoUser, ISignUpResult} from 'amazon-cognito-identity-js';
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

export interface IForgotPassword {
  email: string;
  callback: () => void;
}

export interface IForgotPasswordRequest {
  code: string;
  email: string;
  password: string;
}

export interface IUser extends User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  online?: boolean;
  role: string;
}

export interface ISignUpResponse extends ISignUpResult {}
