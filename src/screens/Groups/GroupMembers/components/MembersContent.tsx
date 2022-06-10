import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import {IGroupMembers} from '~/interfaces/IGroup';
import MemberList from '../../components/MemberList';
import actions from '~/screens/Groups/redux/actions';

interface MembersContentProps {
  groupId: number;
  onPressMenu: (item: IGroupMembers) => void;
}

const MembersContent = ({groupId, onPressMenu}: MembersContentProps) => {
  const dispatch = useDispatch();
  const [sectionList, setSectionList] = useState([]);

  const groupMembers = useKeySelector(groupsKeySelector.groupMembers);
  const can_manage_member = useKeySelector(
    groupsKeySelector.groupDetail.can_manage_member,
  );
  const {loading, canLoadMore} = groupMembers || {};

  const getGroupProfile = () => {
    // to update can_manage_member when member role changes
    dispatch(actions.getGroupDetail(groupId));
  };

  const getMembers = (isRefreshing?: boolean) => {
    if (groupId) {
      dispatch(actions.getGroupMembers({groupId, isRefreshing}));
    }
  };

  useEffect(() => {
    if (groupMembers) {
      const newSectionList: any = [];

      Object.values(groupMembers)?.map((roleData: any) => {
        const section: any = {};
        const {name, data} = roleData || {};

        if (name && data) {
          section.title = `${roleData.name}s`;
          section.data = roleData.data;
          section.user_count = roleData.user_count;
          newSectionList.push(section);
        }
      });

      setSectionList(newSectionList);
    }
  }, [groupMembers]);

  useEffect(() => {
    dispatch(actions.clearGroupMembers());
    getMembers();
    getGroupProfile();

    return () => {
      dispatch(actions.clearGroupMembers());
    };
  }, [groupId]);

  const onLoadMore = () => {
    getMembers();
  };

  const onRefresh = () => {
    getGroupProfile();
    getMembers(true);
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
