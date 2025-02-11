import React from 'react';

import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import TabButtonHeader from '../../../../groups/components/TabButtonHeader';

interface CommunityTabHeaderProps {
  groupId: string;
  communityId: string;
  isMember: boolean;
  teamName: string;
}

const CommunityTabHeader = ({
  groupId, communityId, isMember, teamName,
}: CommunityTabHeaderProps) => {
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

  const onPressTags = () => {
    rootNavigation.navigate(mainTabStack.tags, { id: communityId, groupId, type: 'community' });
  };

  return (
    <TabButtonHeader
      isMember={isMember}
      communityId={communityId}
      teamName={teamName}
      onPressAbout={onPressAbout}
      onPressMembers={onPressMembers}
      onPressDiscover={onPressDiscover}
      onPressTags={onPressTags}
    />
  );
};

export default CommunityTabHeader;
