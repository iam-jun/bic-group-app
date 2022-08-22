import React from 'react';

import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import TabButtonHeader from '../../../groups/components/TabButtonHeader';

interface CommunityTabHeaderProps {
  communityId: string;
  isMember: boolean
}

const CommunityTabHeader = ({ communityId, isMember }: CommunityTabHeaderProps) => {
  const { rootNavigation } = useRootNavigation();

  const onPressDiscover = () => {
    rootNavigation.navigate(groupStack.discoverGroups, { communityId });
  };

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.communityAbout);
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId });
  };

  return (
    <TabButtonHeader
      isMember={isMember}
      onPressAbout={onPressAbout}
      onPressMembers={onPressMembers}
      onPressDiscover={onPressDiscover}
    />
  );
};

export default CommunityTabHeader;
