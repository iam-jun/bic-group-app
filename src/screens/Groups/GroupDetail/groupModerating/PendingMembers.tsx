import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import groupsActions from '../../redux/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import GroupApproveDeclineAllRequests from './components/GroupApproveDeclineAllRequests';
import MemberRequestList from '../../components/MemberRequestList';

const GroupPendingMembers = (props: any) => {
  const dispatch = useDispatch();
  const { params } = props.route;
  const { id: groupId } = params || {};
  const { ids, canLoadMore } = useKeySelector(
    groupsKeySelector.groupMemberRequests,
  );

  const getData = (isRefreshing?: boolean) => {
    dispatch(groupsActions.getGroupMemberRequests({ groupId, isRefreshing }));
  };

  useEffect(() => {
    onRefresh();

    return () => {
      onRefresh(); // to update the total member requests again on press back
    };
  }, [groupId]);

  const onLoadMore = () => {
    canLoadMore && getData();
  };

  const onRefresh = () => {
    getData(true);
  };

  return (
    <ScreenWrapper testID="GroupPendingMembers" isFullView>
      <Header
        title="settings:title_pending_members"
        titleTextProps={{ useI18n: true }}
      />

      <MemberRequestList
        type="group"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />

      {ids.length > 0 && <GroupApproveDeclineAllRequests />}
    </ScreenWrapper>
  );
};

export default GroupPendingMembers;
