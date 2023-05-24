import { StyleProp, ViewStyle } from 'react-native';
import { TextInputProps } from '~/beinComponents/inputs/TextInput';
import { ButtonProps } from '~/baseComponents/Button';
import { TextProps } from '~/baseComponents/Text';
import { languages } from '~/configs';
import { IconType } from '~/resources/icons';
import { BaseToastProps } from '~/baseComponents/Toast/BaseToast';
import { BaseBottomSheetProps } from '~/baseComponents/BottomSheet/BaseBottomSheet';
import { HeaderProps } from '~/beinComponents/Header';
import { ReactionType } from '~/constants/reactions';

export interface IObject<T> {
  [key: string | number]: T;
}

export interface ILanguage {
  code: keyof typeof languages;
  title: string;
  icon: IconType;
}

export interface ISetting {
  type: string;
  title: string;
  icon: IconType;
}

export interface IFilePicked {
  name: string;
  filename: string;
  type: string;
  mime?: string;
  size: number;
  width?: number;
  height?: number;
  uri: string;
  [x: string]: any;
}

export interface IResponseData {
  code: number;
  data: any;
  meta: any;
}

export interface IToastMessage extends BaseToastProps {
  duration?: number;
  timeout?: NodeJS.Timeout;
}

export interface IAlertModal {
  visible?: boolean;
  isDismissible?: boolean;
  title?: string | any;
  titleProps?: TextProps;
  content?: string;
  ContentComponent?: any;
  contentProps?: TextProps;
  input?: boolean;
  inputProps?: TextInputProps
  confirmLabel?: string;
  confirmBtnProps?: ButtonProps;
  ConfirmBtnComponent?: any;
  cancelBtn?: boolean;
  cancelLabel?: string;
  cancelBtnProps?: ButtonProps;
  CancelBtnComponent?: any;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  buttonViewStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  HeaderImageComponent?: any
  onCancel?: () => void;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export interface IPayloadShowModal {
  isOpen: boolean;
  isFullScreen?: boolean;
  titleFullScreen?: string;
  headerFullScreenProps?: HeaderProps;
  ContentComponent: any;
  props?: BaseBottomSheetProps | any;
  useAppBottomSheet?: boolean;
  closeOutSide?: boolean;
}

export interface IReactionBottomSheet {
  visible?: boolean;
  title?: string;
  callback?: (reactionId: ReactionType) => void;
}

export interface ICountryCodeList {
  code: string;
  name: string;
  flag: IconType;
}

export interface ILocation {
  name: string;
  type: string;
  name_with_type: string;
  country: string;
}

export enum SortOder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface IGroupSettings {
  isJoinApproval?: boolean;
  isActiveGroupTerms?: boolean;
  isActiveMembershipQuestions?: boolean;
}
