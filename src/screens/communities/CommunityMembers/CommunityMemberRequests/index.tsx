import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import { useMyPermissions } from '~/hooks/permissions';

interface CommunityMemberRequestsProps {
  communityId: string
}

const CommunityMemberRequests = ({ communityId }: CommunityMemberRequestsProps) => {
  const dispatch = useDispatch();
  const { canLoadMore, ids } = useKeySelector(groupsKeySelector.communityMemberRequests);
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const canAddMember = hasPermissionsOnScopeWithId(
    'communities',
    communityId,
    PERMISSION_KEY.COMMUNITY.ADD_REMOVE_COMMUNITY_MEMBER,
  );

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
    <View style={styles.container} testID="CommunityMemberRequests">

      <MemberRequestList
        type="community"
        canAddMember={canAddMember}
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
        id={communityId}
      />

      {ids.length > 1 && <CommunityApproveDeclineAllRequests />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CommunityMemberRequests;
