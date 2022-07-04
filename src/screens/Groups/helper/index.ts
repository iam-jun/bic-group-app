import modalActions from '~/store/modal/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IGroup} from '~/interfaces/IGroup';
import {isEmpty} from 'lodash';

export const checkLastAdmin = async (
  groupId: string | number,
  userId: number,
  dispatch: any,
  mainCallback: () => void,
  onPressRight: () => void,
  type: 'leave' | 'remove' = 'leave',
) => {
  let testingAdminCount: number; // for testing purpose
  try {
    const data = await groupsDataHelper.getInnerGroupsLastAdmin(
      Number(groupId),
      userId,
    );

    if (data === null || data.length === 0) {
      testingAdminCount = 1;
      mainCallback();
    } else if (data.length === 1 && data[0].id === Number(groupId)) {
      testingAdminCount = 2;
      dispatch(
        modalActions.showHideToastMessage({
          content: `groups:error:last_admin_leave`,
          props: {
            type: 'error',
            textProps: {useI18n: true},
            rightIcon: 'UsersAlt',
            rightText: 'Members',
            onPressRight: onPressRight,
          },
          toastType: 'normal',
        }),
      );
    } else {
      testingAdminCount = 3;
      dispatch(
        modalActions.showHideToastMessage({
          content: `groups:error:last_admin_inner_group_${type}`,
          props: {
            type: 'error',
            textProps: {useI18n: true},
          },
          toastType: 'normal',
        }),
      );
    }
  } catch (err: any) {
    testingAdminCount = -1;
    console.error('[ERROR] error while fetching group members', err);
    dispatch(
      modalActions.showHideToastMessage({
        content:
          err?.meta?.errors?.[0]?.message ||
          err?.meta?.message ||
          'common:text_error_message',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }

  return testingAdminCount;
};

export const handleLeaveInnerGroups = async (
  groupId: number,
  username: string,
  dispatch: any,
  callback: (innerGroups: any) => void,
) => {
  let testingFlag = false; // for testing purpose

  // Get inner groups info (if any) when user leave/being removed from a group
  try {
    const resp = await groupsDataHelper.getUserInnerGroups(groupId, username);
    const innerGroups = resp.data.inner_groups.map(
      (group: IGroup) => group.name,
    );
    testingFlag = true;
    callback(innerGroups);
  } catch (err: any) {
    console.error('Error while fetching user inner groups', err);
    dispatch(
      modalActions.showHideToastMessage({
        content:
          err?.meta?.errors?.[0]?.message ||
          err?.meta?.message ||
          'common:text_error_message',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }
  return testingFlag;
};

export const getGroupFromTreeById = (tree: IGroup, groupId: number) => {
  let group: IGroup;

  const getGroupInChildren = (parent: IGroup, groupId: number) => {
    if (parent?.id === groupId) {
      group = parent;
    } else if (!isEmpty(parent?.children)) {
      parent.children?.map(g => getGroupInChildren(g, groupId));
    }
  };

  getGroupInChildren(tree, groupId);

  // @ts-ignore
  return group;
};

export const getAllChildrenName = (group: IGroup) => {
  const result: string[] = [];
  const getName = (group: IGroup) => {
    result.push(group.name);
    if (!isEmpty(group.children)) {
      group.children?.map(child => {
        getName(child);
      });
    }
  };
  getName(group);
  return result;
};
