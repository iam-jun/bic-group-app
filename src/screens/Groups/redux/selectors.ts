import {createSelector} from 'reselect';
import {useSelector} from 'react-redux';

const groupState = (state: any) => state.groups;

export const getMembersSection = (type: 'group' | 'community') =>
  useSelector(
    createSelector(
      state => groupState(state),
      groupState => {
        const members =
          type === 'group'
            ? groupState.groupMembers
            : groupState.communityMembers;

        const sectionList: any = [];

        Object.values(members)?.map((roleData: any) => {
          const section: any = {};
          const {name, data} = roleData || {};

          if (name && data) {
            section.title = `${roleData.name}`;
            section.data = roleData.data;
            section.user_count = roleData.user_count;
            sectionList.push(section);
          }
        });

        return {
          sectionList,
          loading: members.loading,
          canLoadMore: members.canLoadMore,
        };
      },
    ),
  );
