import { StyleProp, ViewStyle } from 'react-native';
import { IUser } from '~/interfaces/IAuth';

export default interface Props {
  style?: StyleProp<ViewStyle>;
  user: IUser;
  content: string;
  replyCount: number;
  createdAt?: string;
  onActionPress: Function;
}
