import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MemberRequestList from '../../components/MemberRequestList';
import GroupApproveDeclineAllRequests from './components/GroupApproveDeclineAllRequests';
import JoinRequestSetting from '~/screens/communities/CommunityMembers/CommunityMemberRequests/components/JoinRequestSetting';
import useGroupDetailStore, { IGroupDetailState } from '../../GroupDetail/store';
import useGroupMemberStore from '../store';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';

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
  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group } = groups[currentGroupId] || {};
  const { id, settings, privacy } = group || {};
  const { isJoinApproval } = settings || {};
  const {
    actions: { getGroupDetail },
  } = useGroupDetailStore((state: IGroupDetailState) => state);
  const { ids, canLoadMore, total } = useGroupMemberStore((state) => state.groupMemberRequests);
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
        actions.resetGroupMemberRequests();
      };
    }, [id, groupId, canApproveRejectJoiningRequests],
  );

  const getData = (isRefreshing?: boolean) => {
    actions.getGroupMemberRequests({ groupId, isRefreshing });
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
    actions.approveAllGroupMemberRequests({ groupId, total });
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
