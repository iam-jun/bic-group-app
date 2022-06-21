import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import groupsActions from '../../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import ApproveDeclineAllRequests from './ApproveDeclineAllRequests';
import MemberRequestList from '../../components/MemberRequestList';

const CommunityPendingMembers = () => {
  const dispatch = useDispatch();
  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {canLoadMore, ids} = useKeySelector(
    groupsKeySelector.communityMemberRequests,
  );

  useEffect(() => {
    onRefresh();

    return () => {
      onRefresh(); // to update the total member requests again on press back
    };
  }, [communityId]);

  const getData = (isRefreshing?: boolean) => {
    dispatch(
      groupsActions.getCommunityMemberRequests({communityId, isRefreshing}),
    );
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
        titleTextProps={{useI18n: true}}
      />

      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />

      {ids.length > 0 && <ApproveDeclineAllRequests />}
    </ScreenWrapper>
  );
};

export default CommunityPendingMembers;
