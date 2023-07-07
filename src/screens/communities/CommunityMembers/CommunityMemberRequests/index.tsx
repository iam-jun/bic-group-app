import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityMemberStore from '../store';

interface CommunityMemberRequestsProps {
  community: ICommunity;
  canAddMember: boolean;
  canApproveRejectJoiningRequests: boolean;
  onPressAdd?: () => void;
}

const CommunityMemberRequests = ({
  community,
  canAddMember,
  canApproveRejectJoiningRequests,
  onPressAdd,
}: CommunityMemberRequestsProps) => {
  const { communityMemberRequests, actions: communityMemberActions } = useCommunityMemberStore();
  const { canLoadMore, ids } = communityMemberRequests || {};
  const {
    id: communityId, groupId,
  } = community || {};

  useEffect(
    () => {
      if (!canApproveRejectJoiningRequests) return;

      getData();

      return () => {
        communityMemberActions.resetCommunityMemberRequests();
      };
    }, [communityId, canApproveRejectJoiningRequests],
  );

  const getData = (isRefreshing?: boolean) => {
    communityMemberActions.getCommunityMemberRequests({ groupId, isRefreshing });
  };

  const onLoadMore = () => {
    if (!canLoadMore) return;
    getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  return (
    <View style={styles.container} testID="community_member_requests">
      {!!canApproveRejectJoiningRequests && (
        <>
          <MemberRequestList
            type="community"
            canAddMember={canAddMember}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onPressAdd={onPressAdd}
            id={communityId}
          />

          {ids.length > 1 && <CommunityApproveDeclineAllRequests community={community} />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CommunityMemberRequests;
