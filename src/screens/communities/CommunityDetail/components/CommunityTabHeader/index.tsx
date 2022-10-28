import React from 'react';

import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import TabButtonHeader from '../../../../groups/components/TabButtonHeader';

interface CommunityTabHeaderProps {
  communityId: string;
  isMember: boolean;
  teamName: string;
}

const CommunityTabHeader = ({ communityId, isMember, teamName }: CommunityTabHeaderProps) => {
  const { rootNavigation } = useRootNavigation();

  const onPressDiscover = () => {
    rootNavigation.navigate(groupStack.discoverGroups, { communityId });
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.communityAbout, { communityId });
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId, isMember });
  };

  return (
    <TabButtonHeader
      isMember={isMember}
      communityId={communityId}
      teamName={teamName}
      onPressAbout={onPressAbout}
      onPressMembers={onPressMembers}
      onPressDiscover={onPressDiscover}
    />
  );
};

export default CommunityTabHeader;
