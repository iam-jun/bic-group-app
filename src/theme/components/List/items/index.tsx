import ItemUser from './ItemUser';
import TagItem from './TagItem';
import ContentItem from './ContentItem';
import GroupItem from './GroupItem';
import CommentItem from './CommentItem';
import NotificationItem from './NotificationItem';
import ChatItem from './ChatItem';
import ItemOption from './ItemOption';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  content: ContentItem,
  group: GroupItem,
  comment: CommentItem,
  notification: NotificationItem,
  chat: ChatItem,
  option: ItemOption,
};

export default items;
