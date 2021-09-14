import {TextInputProps} from '~/beinComponents/inputs/TextInput';

export interface IShowAlert {
  title?: string;
  content?: string;
  iconName?: string;
  input?: boolean;
  inputProps?: TextInputProps;
  onConfirm?: (text: string) => void;
  cancelBtn?: boolean;
  onCancel?: () => void;
  onDissmiss?: () => void;
  confirmLabel: string;
  isDismissable?: boolean;
}

export interface IPayloadReactionDetailBottomSheet {
  isOpen: boolean;
  getDataPromise?: any;
  [x: string]: any;
}
