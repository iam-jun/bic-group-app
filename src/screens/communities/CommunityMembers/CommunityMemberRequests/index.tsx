import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import JoinRequestSetting from './components/JoinRequestSetting';
import useCommunityController from '../../store';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityMemberStore from '../store';

interface CommunityMemberRequestsProps {
  community: ICommunity;
  canAddMember: boolean;
  canApproveRejectJoiningRequests: boolean;
  canEditJoinSetting: boolean;
  onPressAdd?: () => void;
}

const CommunityMemberRequests = ({
  community,
  canAddMember,
  canApproveRejectJoiningRequests,
  canEditJoinSetting,
  onPressAdd,
}: CommunityMemberRequestsProps) => {
  const controller = useCommunityController((state) => state.actions);

  const { communityMemberRequests, actions: communityMemberActions } = useCommunityMemberStore();
  const { canLoadMore, ids, total } = communityMemberRequests || {};
  const {
    id: communityId, settings, privacy, groupId,
  } = community || {};
  const { isJoinApproval } = settings || {};

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

  const onUpdateJoinSetting = (isJoinApproval: boolean) => {
    controller.updateCommunityJoinSetting(communityId, groupId, isJoinApproval);
  };

  const onPressApproveAll = () => {
    communityMemberActions.approveAllCommunityMemberRequests({ communityId, groupId, total });
  };

  return (
    <View style={styles.container} testID="community_member_requests">
      {!!canEditJoinSetting && (
        <JoinRequestSetting
          type="community"
          total={total}
          privacy={privacy}
          isJoinApproval={isJoinApproval}
          onUpdateJoinSetting={onUpdateJoinSetting}
          onPressApproveAll={onPressApproveAll}
        />
      )}

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
