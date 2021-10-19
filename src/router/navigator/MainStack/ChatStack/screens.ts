import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
  ReviewConversation,
} from '~/screens/Chat';
import UserProfile from '~/screens/Menu/UserProfile';

export default {
  'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'review-conversation': ReviewConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  'user-profile': UserProfile,
};
