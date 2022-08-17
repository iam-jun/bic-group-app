import { StyleProp, ViewStyle } from 'react-native';
import { TextInputProps } from '~/beinComponents/inputs/TextInput';
import { ReactionType } from '~/constants/reactions';
import { IReactionCounts } from '~/interfaces/IPost';
import { ButtonSecondaryProps } from '~/beinComponents/Button/ButtonSecondary';

export interface IShowAlert {
  title?: string;
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
  showCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  confirmBtnProps?: ButtonSecondaryProps;
  cancelBtnProps?: ButtonSecondaryProps;
  children?: any;
}

export interface IPayloadReactionDetailBottomSheet {
  isOpen: boolean;
  reactionCounts: IReactionCounts;
  initReaction: ReactionType;
  getDataPromise?: any;
  getDataParam?: any;
}
