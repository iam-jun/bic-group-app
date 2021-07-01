import ItemUser from './ItemUser';
import TagItem from './TagItem';
import ContentItem from './ContentItem';
import GroupItem from './GroupItem';
import CommentItem from './CommentItem';
import NotificationItem from './NotificationItem';
import ChatItem from './ChatItem';
import ItemOption from './ItemOption';
import ReactionActionItem from './ReactionActionItem';
import ReactionItem from './ReactionItem';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  content: ContentItem,
  group: GroupItem,
  comment: CommentItem,
  notification: NotificationItem,
  chat: ChatItem,
  option: ItemOption,
  reactionActions: ReactionActionItem,
  reaction: ReactionItem,
};

export type IListViewItem = keyof typeof items;

export default items;
