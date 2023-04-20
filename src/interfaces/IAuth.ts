import { ISignUpResult } from 'amazon-cognito-identity-js';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GENDER_TYPE, RELATIONSHIP_TYPE } from './IEditUser';

export enum FieldNameType {
  EMAIL = 'email',
  FULL_NAME = 'fullName',
  USER_NAME = 'userName',
  PASSWORD = 'password',
  NEW_PASSWORD = 'newPassword',
  CONFIRM_PASSWORD = 'confirmPassword',
  CODE = 'code',
}

// Actiontype
export interface ISignIn {
  email: string;
  password: string;
}

export interface SignUpProps {
  route: {
    params: {
      isValidLink: boolean;
      referralCode?: string;
    };
  };
  navigation: NativeStackNavigationProp<any>;
}

export interface IPayloadSignUp {
  referralCode: string;
  email: string;
  fullName: string;
  userName: string;
  password: string;
}

export interface IParamsSignUp {
  referralCode: string;
  user: {
    email: string;
    username: string;
    fullname: string;
    password: string;
  };
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
  name: string; // merge from attributes
  email: string; // merge from attributes
  userId?: string;
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
  gender?: GENDER_TYPE;
  birthday?: string;
  beinStaffRole?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  avatar?: string;
  backgroundImgUrl?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  language?: string[];
  description?: string;
  relationshipStatus?: RELATIONSHIP_TYPE;
  city?: string;
  country?: string;
  latestWork?: {
    company: string;
    titlePosition: string;
  };
  chatUserId?: string;
}

export interface IGetUserProfile {
  userId: string;
  params?: any;
  silentLoading?: boolean;
}

export interface IUserEdit {
  id?: string;
  email?: string;
  fullname?: string;
  gender?: GENDER_TYPE;
  birthday?: string;
  avatar?: string;
  backgroundImgUrl?: string;
  phone?: string;
  countryCode?: string | null;
  address?: string;
  language?: string[];
  description?: string;
  relationshipStatus?: RELATIONSHIP_TYPE;
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

export interface ILanguageResponseItem {
  code: string;
  local: string;
}

export interface ICountryResponseItem {
  name: string;
  flag: string;
  isoCode: string;
  countryCode: string;
}

export interface ICityResponseItem {
  name: string;
  isoCode: string;
  countryCode: string;
}

export interface IFormCheckPassword {
  isLimitCharacter: boolean;
  isUppercaseLetter: boolean;
  isLowercaseLetter: boolean;
  isDigits: boolean;
  isSpecialCharacter: boolean;
}

export interface IVerifyEmail {
  email: string;
  redirectPage: 'login' | 'reset-password'
}

export interface IParamValidateReferralCode {
  code: string;
}
