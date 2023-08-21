import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import useCommunitiesStore from '~/store/entities/communities';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';
import InvitationGroupButtons from '../InvitationGroupButtons';
import { ITypeGroup } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';

type ButtonCommunityInvitationCardProps = {
  communityId: string;
  groupId: string | '';
  type?: ITypeGroup;
  invitationId: string;
  isSearch?: boolean;
};

const ButtonCommunityInvitationCard: FC<ButtonCommunityInvitationCardProps> = ({
  communityId,
  groupId,
  type = ITypeGroup.COMMUNITY,
  invitationId,
  isSearch = false,
}) => {
  const styles = themeStyles();

  const actions = useNotiInvitationsStore((state) => state.actions);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState(false);

  const onDecline = async () => {
    setIsLoadingDecline(true);
    await actions.declineSingleInvitation({ invitationId, callback });
    setIsLoadingDecline(false);
  };

  const onAccept = async () => {
    setIsLoadingAccept(true);
    await actions.acceptSingleInvitation({ invitationId, callback });
    setIsLoadingAccept(false);
  };

  const callback = async () => {
    if (type === ITypeGroup.GROUP) {
      const { getGroupDetail } = useGroupDetailStore.getState().actions;
      const repsonse = await getGroupDetail({ groupId });
      const joinStatus = repsonse?.data?.joinStatus;
      useDiscoverGroupsStore.getState().actions.setGroupStatus(groupId, joinStatus);
    } else {
      const { getCommunity } = useCommunitiesStore.getState().actions;
      getCommunity(communityId);
    }
  };

  return (
    <InvitationGroupButtons
      style={[styles.container, isSearch && styles.searchContainer]}
      styleButton={isSearch && styles.searchButton}
      onAccept={onAccept}
      onDecline={onDecline}
      size={isSearch ? 'small' : 'medium'}
      isLoadingAccept={isLoadingAccept}
      isLoadingDecline={isLoadingDecline}
    />
  );
};

const themeStyles = () => StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  searchContainer: {
    justifyContent: 'flex-end',
  },
  searchButton: {
    flex: 0,
  },
});

export default ButtonCommunityInvitationCard;
