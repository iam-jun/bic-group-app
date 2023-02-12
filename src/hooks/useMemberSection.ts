import useCommunityMemberStore from '~/screens/communities/CommunityMembers/store';
import useGroupMemberStore, {
  IGroupMemberState,
} from '~/screens/groups/GroupMembers/store';

const useMemberSection = (type: 'group' | 'community') => {
  let members:any = {};
  if (type === 'group') {
    members = useGroupMemberStore(
      (state: IGroupMemberState) => state.groupMembers,
    );
  } else members = useCommunityMemberStore((state) => state.communityMembers);

  const sectionList: any = [];

  Object.values(members)?.forEach((roleData: any) => {
    const section: any = {};
    const { name, data, userCount } = roleData || {};

    if (name && data && userCount) {
      section.title = `${name}s`;
      section.data = data;
      section.userCount = userCount;
      sectionList.push(section);
    }
  });

  return {
    sectionList,
    loading: members.loading,
    refreshing: members.refreshing,
    canLoadMore: members.canLoadMore,
  };
};

export default useMemberSection;
