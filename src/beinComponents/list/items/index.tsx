import FlatGroupItem from './FlatGroupItem';
import NotificationItem from './NotificationItem';
import MenuItem from './MenuItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
  notification: NotificationItem,
  menu: MenuItem,
};

export type IListViewItem = keyof typeof items;

export default items;
