import FlatGroupItem from './FlatGroupItem';
import NotificationItem from './NotificationItem';
import MenuItem from './MenuItem';
import PrimaryItem from './PrimaryItem';
import ConversationItem from './ConversationItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
  notification: NotificationItem,
  menu: MenuItem,
  primary: PrimaryItem,
  conversation: ConversationItem,
};

export type IListViewItem = keyof typeof items;

export default items;
