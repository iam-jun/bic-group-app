export type RootStackParamList = {
  MainStack: {
    initialRouteName: string | undefined;
  };
  Conversation: {
    roomId?: string;
    message_id?: string;
    initial?: boolean;
  };
  ConversationDetail: {
    roomId?: string;
  };
  GroupMembers: {
    roomId?: string;
  };
  GroupDetail: {
    groupId?: number;
    initial?: boolean;
  };

  AddMembersToGroup: {
    roomId?: string;
  };
};

export type ITabTypes = 'home' | 'groups' | 'chat' | 'notification' | 'menus';
