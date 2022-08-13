import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import groupsActions from '../../../../storeRedux/groups/actions';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import CommunityApproveDeclineAllRequests from './CommunityApproveDeclineAllRequests';
import MemberRequestList from '../../components/MemberRequestList';

const CommunityPendingMembers = (props: any) => {
  const dispatch = useDispatch();
  const { params } = props.route;
  const { id: communityId } = params || {};
  const { canLoadMore, ids } = useKeySelector(groupsKeySelector.communityMemberRequests);

  useEffect(
    () => {
      onRefresh();

      return () => {
        onRefresh(); // to update the total member requests again on press back
      };
    }, [communityId],
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

  return (
    <ScreenWrapper testID="CommunityPendingMembers" isFullView>
      <Header
        title="settings:title_pending_members"
        titleTextProps={{ useI18n: true }}
      />

      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        id={communityId}
      />

      {ids.length > 0 && <CommunityApproveDeclineAllRequests />}
    </ScreenWrapper>
  );
};

export default CommunityPendingMembers;
