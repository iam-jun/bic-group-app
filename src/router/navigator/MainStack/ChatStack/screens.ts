import {
  Conversation,
  ConversationsList,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
  AddMembersToGroup,
  ReviewConversation,
  SearchConversation,
  EditConversationDescription,
} from '~/screens/Chat';
import EditGroupDescription from '~/screens/Groups/GroupDetail/groupSettings/EditGroupDescription';
import GeneralInformation from '~/screens/Groups/GroupDetail/groupSettings/GeneralInformation';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
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
  'edit-chat-description': EditConversationDescription,

  // Group
  'chat-group-admin': GroupAdministration,
  'chat-general-info': GeneralInformation,
  'chat-edit-group-description': EditGroupDescription,
};
