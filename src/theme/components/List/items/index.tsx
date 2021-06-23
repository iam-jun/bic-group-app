import ItemUser from './ItemUser';
import TagItem from './TagItem';
import ContentItem from './ContentItem';
import GroupItem from './GroupItem';
import CommentItem from './CommentItem';

const items: {[key: string]: any} = {
  user: ItemUser,
  tag: TagItem,
  content: ContentItem,
  group: GroupItem,
  comment: CommentItem,
};

export default items;
