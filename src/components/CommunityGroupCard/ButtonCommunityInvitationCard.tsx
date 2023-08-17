import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import useCommunitiesStore from '~/store/entities/communities';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';
import InvitationGroupButtons from '../InvitationGroupButtons';

type ButtonCommunityInvitationCardProps = {
  communityId: string;
  invitationId: string;
  isSearch?: boolean;
};

const ButtonCommunityInvitationCard: FC<ButtonCommunityInvitationCardProps> = ({
  communityId,
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

  const callback = () => {
    const { getCommunity } = useCommunitiesStore.getState().actions;
    getCommunity(communityId);
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
