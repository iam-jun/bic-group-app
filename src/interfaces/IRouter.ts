export type RootStackParamList = {
  MainStack: {
    initialRouteName: string | undefined;
  };
  Conversation: {
    roomId?: string;
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
