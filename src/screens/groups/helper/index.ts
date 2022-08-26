import { cloneDeep, isEmpty } from 'lodash';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '~/api/GroupApi';
import { IGroup, IRole, IScheme } from '~/interfaces/IGroup';
import { ROLE_TYPE } from '~/constants/permissionScheme';

export const checkLastAdmin = async (
  groupId: string,
  userId: string,
  dispatch: any,
  mainCallback: () => void,
  onPressRight: () => void,
  type: 'leave' | 'remove' = 'leave',
) => {
  let testingAdminCount: number; // for testing purpose
  try {
    const response = await groupApi.getInnerGroupsLastAdmin(
      groupId,
      userId,
    );

    const { data } = response;
    if (data === null || data.length === 0) {
      testingAdminCount = 1;
      mainCallback();
    } else if (data.length === 1 && data[0].id === groupId) {
      testingAdminCount = 2;
      dispatch(modalActions.showHideToastMessage({
        content: 'groups:error:last_admin_leave',
        props: {
          type: 'error',
          textProps: { useI18n: true },
          rightIcon: 'UserGroup',
          rightText: 'Members',
          onPressRight,
        },
        toastType: 'normal',
      }));
    } else {
      testingAdminCount = 3;
      dispatch(modalActions.showHideToastMessage({
        content: `groups:error:last_admin_inner_group_${type}`,
        props: {
          type: 'error',
          textProps: { useI18n: true },
        },
        toastType: 'normal',
      }));
    }
  } catch (err: any) {
    testingAdminCount = -1;
    console.error(
      '[ERROR] error while fetching group members', err,
    );
    dispatch(modalActions.showHideToastMessage({
      content:
          err?.meta?.errors?.[0]?.message
          || err?.meta?.message
          || 'common:text_error_message',
      props: { textProps: { useI18n: true }, type: 'error' },
    }));
  }

  return testingAdminCount;
};

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
    dispatch(modalActions.showHideToastMessage({
      content:
          err?.meta?.errors?.[0]?.message
          || err?.meta?.message
          || 'common:text_error_message',
      props: { textProps: { useI18n: true }, type: 'error' },
    }));
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
  fixedRoles.sort((
    a, b,
  ) => desiredFixedOrder.indexOf(a.type) - desiredFixedOrder.indexOf(b.type));

  const newOrderedRoles = [...fixedRoles, ...customRoles];

  return { ...cloneDeep(data), roles: newOrderedRoles };
};

// Community: level is undefined or level = 0
// Group: level > 0
export const isGroup = (level?: number) => !!level;
