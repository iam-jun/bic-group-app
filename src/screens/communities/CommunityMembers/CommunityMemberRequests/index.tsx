import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import JoinRequestSetting from './components/JoinRequestSetting';
import useCommunityController from '../../store';
import { ICommunity } from '~/interfaces/ICommunity';

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
  const dispatch = useDispatch();
  const controller = useCommunityController((state) => state.actions);

  const { canLoadMore, ids, total } = useKeySelector(groupsKeySelector.communityMemberRequests);
  const {
    id: communityId, settings, privacy, groupId,
  } = community || {};
  const { isJoinApproval } = settings || {};

  useEffect(
    () => {
      if (canApproveRejectJoiningRequests) {
        getData();

        return () => {
          dispatch(groupsActions.resetCommunityMemberRequests());
        };
      }
    }, [communityId, canApproveRejectJoiningRequests],
  );

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getCommunityMemberRequests({ groupId, isRefreshing }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const onUpdateJoinSetting = (isJoinApproval: boolean) => {
    controller.updateCommunityJoinSetting(communityId, groupId, isJoinApproval);
  };

  const onPressApproveAll = () => {
    dispatch(groupsActions.approveAllCommunityMemberRequests({ communityId, groupId, total }));
  };

  return (
    <View style={styles.container} testID="CommunityMemberRequests">
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
