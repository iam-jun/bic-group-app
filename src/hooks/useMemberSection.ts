import useGroupMemberStore, {
  IGroupMemberState,
} from '~/screens/groups/GroupMembers/store';

const useMemberSection = () => {
  // Waiting refactor communityMembers to make condition type ...
  const members = useGroupMemberStore(
    (state: IGroupMemberState) => state.groupMembers,
  );

  const sectionList: any = [];

  Object.values(members)?.map((roleData: any) => {
    const section: any = {};
    const { name, data, userCount } = roleData || {};

    if (name && data && userCount) {
      section.title = `${name}s`;
      section.data = data;
      section.userCount = userCount;
      sectionList.push(section);
    }

    return true;
  });

  return {
    sectionList,
    loading: members.loading,
    canLoadMore: members.canLoadMore,
  };
};

export default useMemberSection;
