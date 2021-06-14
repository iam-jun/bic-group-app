import {CognitoUser} from 'amazon-cognito-identity-js';
// Actiontype
export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp {
  username: string;
  email: string;
  password: string;
  callback: (param: any) => void;
}

export interface IForgotPassword {
  email: string;
  callback: () => void;
}

export interface IForgotPasswordSubmit {
  code: string;
  email: string;
  password: string;
  submitPasswordCb: () => void;
}

export interface IUser extends CognitoUser {}
