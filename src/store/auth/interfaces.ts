import {CognitoUser, ISignUpResult} from 'amazon-cognito-identity-js';
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

export interface IUser extends CognitoUser {}

export interface ISignUpResponse extends ISignUpResult {}
