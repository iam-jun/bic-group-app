import FlatGroupItem from './FlatGroupItem';
import NotificationItem from './NotificationItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
  notification: NotificationItem,
};

export type IListViewItem = keyof typeof items;

export default items;
