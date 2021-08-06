import FlatGroupItem from './FlatGroupItem';
import NotificationItem from './NotificationItem';
import MenuItem from './MenuItem';
import PrimaryItem from './PrimaryItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
  notification: NotificationItem,
  menu: MenuItem,
  primary: PrimaryItem,
};

export type IListViewItem = keyof typeof items;

export default items;
