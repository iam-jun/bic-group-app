import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MemberRequestList from '../../components/MemberRequestList';
import GroupApproveDeclineAllRequests from './components/GroupApproveDeclineAllRequests';
import useGroupDetailStore, { IGroupDetailState } from '../../GroupDetail/store';
import useGroupMemberStore from '../store';
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';

interface GroupMemberRequestsProps {
  groupId: string;
  canApproveRejectJoiningRequests: boolean;
}

const GroupMemberRequests = ({
  groupId,
  canApproveRejectJoiningRequests,
}: GroupMemberRequestsProps) => {
  const groups = useGroupsStore((state: IGroupsState) => state.groups);
  const { group } = groups[groupId] || {};
  const { id } = group || {};
  const {
    actions: { getGroupDetail },
  } = useGroupDetailStore((state: IGroupDetailState) => state);
  const { ids, canLoadMore } = useGroupMemberStore((state) => state.groupMemberRequests);
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

  return (
    <View style={styles.container} testID="GroupMemberRequests">
      {!!canApproveRejectJoiningRequests && (
        <>
          <MemberRequestList
            type="group"
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
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
