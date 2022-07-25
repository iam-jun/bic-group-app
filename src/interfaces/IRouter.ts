export type RootStackParamList = {
  MainStack: {
    initialRouteName: string | undefined;
  };
  GroupMembers: {
    roomId?: string;
  };
  GroupDetail: {
    groupId?: string;
    initial?: boolean;
  };

  AddMembersToGroup: {
    roomId?: string;
  };
};

export type ITabTypes = 'home' | 'groups' | 'notification' | 'menus';
