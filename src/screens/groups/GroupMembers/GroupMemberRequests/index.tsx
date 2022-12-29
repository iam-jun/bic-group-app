import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import groupsActions from '~/storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import MemberRequestList from '../../components/MemberRequestList';
import GroupApproveDeclineAllRequests from './components/GroupApproveDeclineAllRequests';
import JoinRequestSetting from '~/screens/communities/CommunityMembers/CommunityMemberRequests/components/JoinRequestSetting';
import useGroupDetailStore, { IGroupDetailState } from '../../GroupDetail/store';
import useGroupMemberStore from '../store';

interface GroupMemberRequestsProps {
  groupId: string;
  canAddMember: boolean;
  canApproveRejectJoiningRequests: boolean;
  canEditJoinSetting: boolean
  onPressAdd?: () => void;
}

const GroupMemberRequests = ({
  groupId,
  canAddMember,
  canApproveRejectJoiningRequests,
  canEditJoinSetting,
  onPressAdd,
}: GroupMemberRequestsProps) => {
  const dispatch = useDispatch();
  const { ids, canLoadMore, total } = useKeySelector(groupsKeySelector.groupMemberRequests);
  const {
    groupDetail: {
      group: { id, settings, privacy },
    },
    actions: { getGroupDetail },
  } = useGroupDetailStore((state: IGroupDetailState) => state);
  const { isJoinApproval } = settings || {};
  const actions = useGroupMemberStore((state) => state.actions);

  useEffect(
    () => {
      if (!id || id !== groupId) {
        // get data if navigation from notification screen
        getGroupDetail({ groupId });
      }

      if (!canApproveRejectJoiningRequests) return;

      getData();
      return () => {
        dispatch(groupsActions.resetGroupMemberRequests());
      };
    }, [id, groupId, canApproveRejectJoiningRequests],
  );

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getGroupMemberRequests({ groupId, isRefreshing }));
  };

  const onLoadMore = () => {
    if (!canLoadMore) return;
    getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  const onUpdateJoinSetting = (isJoinApproval: boolean) => {
    actions.updateGroupJoinSetting({ groupId, isJoinApproval });
  };

  const onPressApproveAll = () => {
    dispatch(groupsActions.approveAllGroupMemberRequests({ groupId, total }));
  };

  return (
    <View style={styles.container} testID="GroupMemberRequests">
      {!!canEditJoinSetting && (
        <JoinRequestSetting
          type="group"
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
            type="group"
            canAddMember={canAddMember}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onPressAdd={onPressAdd}
          />

          {ids.length > 1 && <GroupApproveDeclineAllRequests groupId={groupId} />}
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

export default GroupMemberRequests;
