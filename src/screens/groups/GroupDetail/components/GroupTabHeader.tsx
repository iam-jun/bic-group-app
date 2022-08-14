import React from 'react'

import { useRootNavigation } from '~/hooks/navigation'
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack'
import TabButtonHeader from '../../components/TabButtonHeader'

interface GroupTabHeaderProps {
  groupId: string;
  isMember: boolean
}

const GroupTabHeader = ({ groupId, isMember }: GroupTabHeaderProps) => {
  const { rootNavigation } = useRootNavigation();

  const onPressAbout = () => {
    rootNavigation.navigate(groupStack.groupAbout);
  };

  const onPressMembers = () => {
    rootNavigation.navigate(groupStack.groupMembers, { groupId });
  };

  return (
    <TabButtonHeader
      isMember={isMember}
      onPressAbout={onPressAbout}
      onPressMembers={onPressMembers}
    />
  )
}

export default GroupTabHeader;
