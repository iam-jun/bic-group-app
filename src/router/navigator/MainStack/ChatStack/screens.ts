import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
} from '~/screens/Chat';
import UserProfile from '~/screens/Menu/UserProfile/UserProfile';

export default {
  'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  'user-profile': UserProfile,
};
