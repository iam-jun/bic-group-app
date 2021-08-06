import FlatGroupItem from './FlatGroupItem';
import NotificationItem from './NotificationItem';
import MenuItem from './MenuItem';
import ConversationItem from './ConversationItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
  notification: NotificationItem,
  menu: MenuItem,
  conversation: ConversationItem,
};

export type IListViewItem = keyof typeof items;

export default items;
