import {StyleProp, ViewStyle} from 'react-native';
import {TextInputProps} from '~/beinComponents/inputs/TextInput';
import {ReactionType} from '~/constants/reactions';

export interface IShowAlert {
  title?: string;
  content?: string;
  iconName?: string;
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
  stretchOnWeb?: boolean;
}

export interface IPayloadReactionDetailBottomSheet {
  isOpen: boolean;
  reactionCounts: {[x: string]: number};
  initReaction: ReactionType;
  getDataPromise?: any;
  getDataParam?: any;
}
