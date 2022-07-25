import {createSelector} from 'reselect';
import {useSelector} from 'react-redux';

export const getMembersSection = (type: 'group' | 'community') =>
  useSelector(
    createSelector(
      (state: any) => state.groups[`${type}Members`],
      memberState => {
        const sectionList: any = [];

        Object.values(memberState)?.map((roleData: any) => {
          const section: any = {};
          const {name, data, userCount} = roleData || {};

          if (name && data && userCount) {
            section.title = `${roleData.name}s`;
            section.data = roleData.data;
            section.userCount = roleData.userCount;
            sectionList.push(section);
          }
        });

        return {
          sectionList,
          loading: memberState.loading,
          canLoadMore: memberState.canLoadMore,
        };
      },
    ),
  );
