import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import {ICommunityMembers} from '~/interfaces/ICommunity';
import MemberList from '../components/MemberList';
import actions from '~/screens/Groups/redux/actions';

interface MembersContentProps {
  communityId: number;
  onPressMenu: (item: ICommunityMembers) => void;
}

const MembersContent = ({communityId, onPressMenu}: MembersContentProps) => {
  const dispatch = useDispatch();
  const [sectionList, setSectionList] = useState([]);

  const {loading, canLoadMore, community_admin, community_member, offset} =
    useKeySelector(groupsKeySelector.communityMembers);
  const {can_manage_member} = useKeySelector(groupsKeySelector.communityDetail);

  useEffect(() => {
    const newSectionList: any = [
      {
        title: 'Admins',
        data: community_admin.data,
        user_count: community_admin.user_count,
      },
      {
        title: 'Members',
        data: community_member.data,
        user_count: community_member.user_count,
      },
    ];

    setSectionList(newSectionList);
  }, [offset]);

  useEffect(() => {
    getCommunityDetail();
    getCommunityMembers();

    return () => {
      resetCommunityMembers();
    };
  }, [communityId]);

  const getCommunityMembers = (isRefreshing?: boolean) => {
    dispatch(actions.getCommunityMembers({communityId, isRefreshing}));
  };

  const resetCommunityMembers = () => {
    dispatch(actions.resetCommunityMembers());
  };

  const getCommunityDetail = () => {
    // to update can_manage_member when member role changes
    dispatch(actions.getCommunityDetail(communityId));
  };

  const onLoadMore = () => {
    getCommunityMembers();
  };

  const onRefresh = () => {
    getCommunityDetail();
    getCommunityMembers(true);
  };

  return (
    <MemberList
      canManageMember={can_manage_member}
      memberData={{loading, canLoadMore, sectionList}}
      onLoadMore={onLoadMore}
      onPressMenu={onPressMenu}
      onRefresh={onRefresh}
    />
  );
};

export default MembersContent;
