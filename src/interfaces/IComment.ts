import {StyleProp, ViewStyle} from 'react-native';
import {IUser} from '~/store/auth/interfaces';

export default interface Props {
  style?: StyleProp<ViewStyle>;
  user: IUser;
  content: string;
  replyCount: number;
  createdAt?: string;
  onActionPress: Function;
}
