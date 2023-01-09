import { cloneDeep, isEmpty } from 'lodash';
import groupApi from '~/api/GroupApi';
import { IGroup, IRole, IScheme } from '~/interfaces/IGroup';
import { RoleType } from '~/constants/permissionScheme';
import showToastError from '~/store/helper/showToastError';

export const handleLeaveInnerGroups = async (
  groupId: string,
  username: string,
  dispatch: any,
  callback: (innerGroups: any) => void,
) => {
  let testingFlag = false; // for testing purpose

  // Get inner groups info (if any) when user leave/being removed from a group
  try {
    const resp = await groupApi.getUserInnerGroups(groupId, username);
    const innerGroups = resp?.data?.innerGroups?.map?.(
      (group: IGroup) => group.name,
    );
    testingFlag = true;
    callback(innerGroups);
  } catch (err: any) {
    console.error(
      'Error while fetching user inner groups', err,
    );
    showToastError(err);
  }
  return testingFlag;
};

export const getGroupFromTreeById = (
  tree: IGroup, groupId: string,
) => {
  let group: IGroup;

  const getGroupInChildren = (
    parent: IGroup, groupId: string,
  ) => {
    if (parent?.id === groupId) {
      group = parent;
    } else if (!isEmpty(parent?.children)) {
      parent.children?.map((g) => getGroupInChildren(
        g, groupId,
      ));
    }
  };

  getGroupInChildren(
    tree, groupId,
  );

  return group;
};

export const getAllChildrenName = (group: IGroup) => {
  const result: string[] = [];
  const getName = (g: IGroup) => {
    result.push(g.name);
    if (!isEmpty(g.children)) {
      g.children?.forEach((child) => {
        getName(child);
      });
    }
  };
  group.children?.forEach((child) => {
    getName(child);
  });
  return result;
};

export const sortFixedRoles = (data: IScheme) => {
  const roles = cloneDeep(data)?.roles;

  const fixedRoles: IRole[] = [];
  const customRoles: IRole[] = [];

  const desiredFixedOrder = [
    RoleType.COMMUNITY_ADMIN,
    RoleType.GROUP_ADMIN,
    RoleType.MEMBER,
  ];

  roles?.forEach((role: IRole) => {
    if (desiredFixedOrder.includes(role?.type)) {
      fixedRoles.push(role);
    } else {
      customRoles.push(role);
    }
  });

  // sorting fixedRoles based on the order of desiredFixedOrder array
  fixedRoles.sort((
    a, b,
  ) => desiredFixedOrder.indexOf(a.type) - desiredFixedOrder.indexOf(b.type));

  const newOrderedRoles = [...fixedRoles, ...customRoles];

  return { ...cloneDeep(data), roles: newOrderedRoles };
};
