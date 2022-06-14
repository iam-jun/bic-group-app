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
          const {name, data, user_count} = roleData || {};

          if (name && data && user_count) {
            section.title = `${roleData.name}s`;
            section.data = roleData.data;
            section.user_count = roleData.user_count;
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
