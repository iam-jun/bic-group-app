import {createSelector} from 'reselect';
import {useSelector} from 'react-redux';
import {cloneDeep} from 'lodash';

import {IRole} from '~/interfaces/IGroup';
import {ROLE_TYPE} from '~/constants/permissionScheme';

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

export const getOrderedPermissionRoles = (
  type: 'system' | 'community' | 'creating',
) =>
  useSelector(
    createSelector(
      (state: any) => state.groups.permissionScheme[`${type}Scheme`]?.data,
      schemeData => {
        const roles = cloneDeep(schemeData?.roles);

        const fixedRoles: IRole[] = [];
        const customRoles: IRole[] = [];

        const desiredFixedOrder = [
          ROLE_TYPE.COMMUNITY_ADMIN,
          ROLE_TYPE.GROUP_ADMIN,
          ROLE_TYPE.MEMBER,
        ];

        roles?.forEach((role: IRole) => {
          if (desiredFixedOrder.includes(role?.type)) {
            fixedRoles.push(role);
          } else {
            customRoles.push(role);
          }
        });

        // sorting fixedRoles based on the order of desiredFixedOrder array
        fixedRoles.sort(
          (a, b) =>
            desiredFixedOrder.indexOf(a.type) -
            desiredFixedOrder.indexOf(b.type),
        );

        return [...fixedRoles, ...customRoles];
      },
    ),
  );
