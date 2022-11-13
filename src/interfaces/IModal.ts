import { StyleProp, ViewStyle } from 'react-native';
import { ButtonProps } from '~/baseComponents/Button';
import { TextInputProps } from '~/beinComponents/inputs/TextInput';
import { ReactionType } from '~/constants/reactions';
import { IReactionCounts } from '~/interfaces/IPost';

export interface IShowAlert {
  title?: string | any;
  content?: string;
  input?: boolean;
  inputProps?: TextInputProps;
  onConfirm?: (text: string) => void;
  cancelBtn?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  onDismiss?: () => void;
  confirmLabel?: string;
  isDismissible?: boolean;
  style?: StyleProp<ViewStyle>;
  confirmBtnProps?: ButtonProps;
  cancelBtnProps?: ButtonProps;
  children?: any;
  ConfirmBtnComponent?: any;
}

export interface IPayloadReactionDetailBottomSheet {
  isOpen: boolean;
  reactionsCount: IReactionCounts;
  initReaction: ReactionType;
  getDataParam?: any;
}
