import ItemUser from './ItemUser';
import TagItem from './TagItem';
import CommentItem from './CommentItem';
import NotificationItem from './NotificationItem';
import ChatItem from './ChatItem';
import OptionItem from './OptionItem';
import MenuItem from './MenuItem';
import PeopleAudienceItem from './PeopleAudienceItem';
import FlatGroupItem from '~/components/list/items/FlatGroupItem';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  comment: CommentItem,
  notification: NotificationItem,
  chat: ChatItem,
  option: OptionItem,
  menu: MenuItem,
  people: PeopleAudienceItem,
  flatGroups: FlatGroupItem,
};

export type IListViewItem = keyof typeof items;

export default items;
