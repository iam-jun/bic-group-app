import React from 'react';

import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import TabButtonHeader from '../../components/TabButtonHeader';

interface GroupTabHeaderProps {
  groupId: string;
  isMemberCommunity: boolean;
  isMember: boolean;
  communityId: string;
  teamName: string;
}

const GroupTabHeader = ({
  groupId,
  isMemberCommunity,
  isMember,
  communityId,
  teamName,
}: GroupTabHeaderProps) => {
  const { rootNavigation } = useRootNavigation();

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.groupAbout, { groupId });
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId, isMemberCommunity, communityId });
  };

  const onPressTags = () => {
    rootNavigation.navigate(mainTabStack.tags, { type: 'group', groupId });
  };

  return (
    <TabButtonHeader
      isMember={isMember}
      communityId={communityId}
      teamName={teamName}
      onPressAbout={onPressAbout}
      onPressMembers={onPressMembers}
      onPressTags={onPressTags}
    />
  );
};

export default GroupTabHeader;
