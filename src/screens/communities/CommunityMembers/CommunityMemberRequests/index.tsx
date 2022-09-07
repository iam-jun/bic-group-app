import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import JoinRequestSetting from './components/JoinRequestSetting';

interface CommunityMemberRequestsProps {
  communityId: string
  canAddMember: boolean;
  canApproveRejectJoiningRequests: boolean;
  canEditJoinSetting: boolean;
  onPressAdd?: () => void;
}

const CommunityMemberRequests = ({
  communityId,
  canAddMember,
  canApproveRejectJoiningRequests,
  canEditJoinSetting,
  onPressAdd,
}: CommunityMemberRequestsProps) => {
  const dispatch = useDispatch();
  const { canLoadMore, ids, total } = useKeySelector(groupsKeySelector.communityMemberRequests);
  const { id, settings } = useKeySelector(groupsKeySelector.communityDetail);
  const { isJoinApproval } = settings || {};

  useEffect(
    () => {
      if (!id || id !== communityId) {
        // get data if navigation from notification screen
        dispatch(groupsActions.getCommunityDetail({ communityId }));
      }

      if (canApproveRejectJoiningRequests) {
        getData();

        return () => {
          dispatch(groupsActions.resetCommunityMemberRequests());
        };
      }
    }, [communityId, canApproveRejectJoiningRequests],
  );

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getCommunityMemberRequests({ communityId, isRefreshing }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const onUpdateJoinSetting = (isJoinApproval: boolean) => {
    dispatch(groupsActions.updateCommunityJoinSetting({ communityId, isJoinApproval }));
  };

  const onPressApproveAll = () => {
    dispatch(groupsActions.approveAllCommunityMemberRequests({ communityId, total }));
  };

  return (
    <View style={styles.container} testID="CommunityMemberRequests">
      {!!canEditJoinSetting && (
        <JoinRequestSetting
          type="community"
          total={total}
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

          {ids.length > 1 && <CommunityApproveDeclineAllRequests communityId={communityId} />}
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
