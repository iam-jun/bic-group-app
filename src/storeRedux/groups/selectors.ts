import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';

export const getMembersSection = (type: 'group' | 'community') => useSelector(createSelector(
  (state: any) => state.groups[`${type}Members`],
  (memberState) => {
    const sectionList: any = [];

    // eslint-disable-next-line array-callback-return
    Object.values(memberState)?.map((roleData: any) => {
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
      loading: memberState.loading,
      canLoadMore: memberState.canLoadMore,
    };
  },
));
