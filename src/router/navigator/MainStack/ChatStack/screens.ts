import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
} from '~/screens/Chat';
import PublicProfile from '~/screens/Menu/UserProfile/PublicView';

export default {
  'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  'user-profile': PublicProfile,
};
