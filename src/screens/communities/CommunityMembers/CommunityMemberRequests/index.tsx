import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';

interface CommunityMemberRequestsProps {
  communityId: string
  canAddMember: boolean;
}

const CommunityMemberRequests = ({ communityId, canAddMember }: CommunityMemberRequestsProps) => {
  const dispatch = useDispatch();
  const { canLoadMore, ids } = useKeySelector(groupsKeySelector.communityMemberRequests);

  useEffect(
    () => {
      getData();

      return () => {
        dispatch(groupsActions.resetCommunityMemberRequests());
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
    <View style={styles.container} testID="CommunityMemberRequests">

      <MemberRequestList
        type="community"
        canAddMember={canAddMember}
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        id={communityId}
      />

      {ids.length > 1 && <CommunityApproveDeclineAllRequests communityId={communityId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CommunityMemberRequests;
