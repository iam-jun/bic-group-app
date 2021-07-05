import ItemUser from './ItemUser';
import TagItem from './TagItem';
import ContentItem from './ContentItem';
import GroupItem from './GroupItem';
import CommentItem from './CommentItem';
import NotificationItem from './NotificationItem';
import ChatItem from './ChatItem';
import OptionItem from './OptionItem';
import ReactionActionItem from './ReactionActionItem';
import ReactionItem from './ReactionItem';
import MenuItem from './MenuItem';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  content: ContentItem,
  group: GroupItem,
  comment: CommentItem,
  notification: NotificationItem,
  chat: ChatItem,
  option: OptionItem,
  reactionActions: ReactionActionItem,
  reaction: ReactionItem,
  menu: MenuItem,
};

export type IListViewItem = keyof typeof items;

export default items;
