import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import groupsActions from '~/storeRedux/groups/actions';
import MemberRequestList from '~/screens/groups/components/MemberRequestList';
import CommunityApproveDeclineAllRequests from './components/CommunityApproveDeclineAllRequests';
import JoinRequestSetting from './components/JoinRequestSetting';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import useCommunityController from '../../store';

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
  const controller = useCommunityController((state) => state.actions);
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);
  const data = useCommunitiesStore((state: ICommunitiesState) => state.data[communityId]);

  const { canLoadMore, ids, total } = useKeySelector(groupsKeySelector.communityMemberRequests);
  const { id, settings, privacy } = data || {};
  const { isJoinApproval } = settings || {};

  useEffect(
    () => {
      if (!id || id !== communityId) {
        // get data if navigation from notification screen
        getCommunityDetail();
      }

      if (canApproveRejectJoiningRequests) {
        getData();

        return () => {
          dispatch(groupsActions.resetCommunityMemberRequests());
        };
      }
    }, [communityId, canApproveRejectJoiningRequests],
  );

  const getCommunityDetail = () => {
    actions.getCommunity(communityId);
  };

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
    controller.updateCommunityJoinSetting(communityId, isJoinApproval);
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
          privacy={privacy}
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
