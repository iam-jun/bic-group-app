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
};
