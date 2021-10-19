import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
  ReviewConversation,
} from '~/screens/Chat';
import PostDetail from '~/screens/Post/PostDetail';

export default {
  'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'review-conversation': ReviewConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  'post-detail': PostDetail,
};
