import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import groupsActions from '~/storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import MemberRequestList from '../../components/MemberRequestList';
import GroupApproveDeclineAllRequests from './components/GroupApproveDeclineAllRequests';

interface GroupMemberRequestsProps {
  groupId: string;
  canAddMember: boolean;
  onPressAdd?: () => void;
}

const GroupMemberRequests = ({ groupId, canAddMember, onPressAdd }: GroupMemberRequestsProps) => {
  const dispatch = useDispatch();
  const { ids, canLoadMore } = useKeySelector(groupsKeySelector.groupMemberRequests);

  useEffect(
    () => {
      getData();

      return () => {
        dispatch(groupsActions.resetGroupMemberRequests());
      };
    }, [groupId],
  );

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getGroupMemberRequests({ groupId, isRefreshing }));
  };

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  return (
    <View style={styles.container} testID="GroupMemberRequests">

      <MemberRequestList
        type="group"
        canAddMember={canAddMember}
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        onPressAdd={onPressAdd}
      />

      {ids.length > 1 && <GroupApproveDeclineAllRequests groupId={groupId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GroupMemberRequests;
