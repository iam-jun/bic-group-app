import ItemUser from './ItemUser';
import TagItem from './TagItem';
import ContentItem from './ContentItem';
import CommentItem from './CommentItem';
import NotificationItem from './NotificationItem';
import ChatItem from './ChatItem';
import OptionItem from './OptionItem';
import ReactionActionItem from './ReactionActionItem';
import ReactionItem from './ReactionItem';
import MenuItem from './MenuItem';
import PeopleAudienceItem from './PeopleAudienceItem';
import FlatGroupItem from '~/components/list/items/FlatGroupItem';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  content: ContentItem,
  comment: CommentItem,
  notification: NotificationItem,
  chat: ChatItem,
  option: OptionItem,
  reactionActions: ReactionActionItem,
  reaction: ReactionItem,
  menu: MenuItem,
  people: PeopleAudienceItem,
  flatGroups: FlatGroupItem,
};

export type IListViewItem = keyof typeof items;

export default items;
