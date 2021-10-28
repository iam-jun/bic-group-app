import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
  ReviewConversation,
  SearchConversation,
} from '~/screens/Chat';
import UserProfile from '~/screens/Menu/UserProfile';
import PostDetail from '~/screens/Post/PostDetail';

export default {
  'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'review-conversation': ReviewConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  'user-profile': UserProfile,
  'post-detail': PostDetail,
  'search-conversation': SearchConversation,
};
