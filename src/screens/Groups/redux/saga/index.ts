import i18next from 'i18next';
import {
  call, put, select, takeLatest,
} from 'redux-saga/effects';

import { AxiosResponse } from 'axios';
import {
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupImageUpload,
} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';
import * as modalActions from '~/store/modal/actions';
import { IResponseData, IToastMessage } from '~/interfaces/common';
import { mapData } from '../../helper/mapper';
import appConfig from '~/configs/appConfig';
import ImageUploader, { IGetFile } from '~/services/imageUploader';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

import joinNewGroup from './joinNewGroup';
import leaveGroup from './leaveGroup';
import getGroupDetail from './getGroupDetail';
import editGroupDetail from './editGroupDetail';
import getGroupPosts from './getGroupPosts';
import mergeExtraGroupPosts from './mergeExtraGroupPosts';
import removeMember from './removeMember';
import removeGroupAdmin from './removeGroupAdmin';
import setGroupAdmin from './setGroupAdmin';
import showError from '~/store/commonSaga/showError';
import getJoinedCommunities from './getJoinedCommunities';
import getCommunityGroups from './getCommunityGroups';
import getYourGroupsTree from '~/screens/Groups/redux/saga/getYourGroupsTree';
import getYourGroupsList from '~/screens/Groups/redux/saga/getYourGroupsList';
import getCommunityDetail from './getCommunityDetail';
import getDiscoverCommunities from '~/screens/Groups/redux/saga/getDiscoverCommunities';
import getYourGroupsSearch from '~/screens/Groups/redux/saga/getYourGroupsSearch';
import getCommunityMembers from './getCommunityMembers';
import getDiscoverGroups from './getDiscoverGroups';
import getManagedCommunities from './getManagedCommunities';
import getCommunitySearchMembers from './getCommunitySearchMembers';
import getGroupMembers from './getGroupMembers';
import getGroupSearchMembers from './getGroupSearchMembers';
import joinCommunity from './joinCommunity';
import cancelJoinCommunity from './cancelJoinCommunity';
import getCommunityMemberRequests from './getCommunityMemberRequests';
import groupJoinStatus from '~/constants/groupJoinStatus';
import approveSingleCommunityMemberRequest from './approveSingleCommunityMemberRequest';
import declineSingleCommunityMemberRequest from './declineSingleCommunityMemberRequest';
import approveAllCommunityMemberRequests from './approveAllCommunityMemberRequests';
import declineAllCommunityMemberRequests from './declineAllCommunityMemberRequests';
import approveAllGroupMemberRequests from './approveAllGroupMemberRequests';
import declineAllGroupMemberRequests from './declineAllGroupMemberRequests';
import approveSingleGroupMemberRequest from './approveSingleGroupMemberRequest';
import declineSingleGroupMemberRequest from './declineSingleGroupMemberRequest';
import getGroupMemberRequests from './getGroupMemberRequests';
import getPermissionCategories from '~/screens/Groups/redux/saga/getPermissionCategories';
import getSystemScheme from '~/screens/Groups/redux/saga/getSystemScheme';
import postCreateSchemePermission from '~/screens/Groups/redux/saga/postCreateSchemePermission';
import getSchemes from '~/screens/Groups/redux/saga/getSchemes';
import getCommunityScheme from '~/screens/Groups/redux/saga/getCommunityScheme';
import updateCommunityScheme from './updateCommunityScheme';
import deleteCommunityScheme from '~/screens/Groups/redux/saga/deleteCommunityScheme';
import getCommunitySearch from './getCommunitySearch';
import getGroupScheme from './getGroupScheme';
import updateGroupScheme from './updateGroupScheme';
import getGroupStructureCommunityTree from '~/screens/Groups/redux/saga/getGroupStructureCommunityTree';
import putGroupStructureReorder from '~/screens/Groups/redux/saga/putGroupStructureReorder';
import getGroupStructureMoveTargets from '~/screens/Groups/redux/saga/getGroupStructureMoveTargets';
import putGroupStructureMoveToTarget from '~/screens/Groups/redux/saga/putGroupStructureMoveToTarget';
import putGroupStructureCollapseStatus from '~/screens/Groups/redux/saga/putGroupStructureCollapseStatus';
import editCommunityDetail from './editCommunityDetail';
import getGroupSchemeAssignments from '~/screens/Groups/redux/saga/getGroupSchemeAssignments';
import putGroupSchemeAssignments from '~/screens/Groups/redux/saga/putGroupSchemeAssignments';
import getMyPermissions from './getMyPermissions';

const navigation = withNavigation(rootNavigationRef);

export default function* groupsSaga() {
  yield takeLatest(groupsTypes.GET_MY_PERMISSIONS, getMyPermissions);
  yield takeLatest(
    groupsTypes.GET_GROUP_STRUCTURE_COMMUNITY_TREE,
    getGroupStructureCommunityTree,
  );
  yield takeLatest(
    groupsTypes.GET_PERMISSION_CATEGORIES,
    getPermissionCategories,
  );
  yield takeLatest(
    groupsTypes.PUT_GROUP_STRUCTURE_REORDER,
    putGroupStructureReorder,
  );
  yield takeLatest(
    groupsTypes.GET_GROUP_STRUCTURE_MOVE_TARGETS,
    getGroupStructureMoveTargets,
  );
  yield takeLatest(
    groupsTypes.PUT_GROUP_STRUCTURE_MOVE_TO_TARGET,
    putGroupStructureMoveToTarget,
  );
  yield takeLatest(
    groupsTypes.PUT_GROUP_STRUCTURE_COLLAPSE_STATUS,
    putGroupStructureCollapseStatus,
  );
  yield takeLatest(groupsTypes.GET_SYSTEM_SCHEME, getSystemScheme);
  yield takeLatest(groupsTypes.GET_SCHEMES, getSchemes);
  yield takeLatest(groupsTypes.GET_COMMUNITY_SCHEME, getCommunityScheme);
  yield takeLatest(groupsTypes.UPDATE_COMMUNITY_SCHEME, updateCommunityScheme);
  yield takeLatest(groupsTypes.DELETE_COMMUNITY_SCHEME, deleteCommunityScheme);
  yield takeLatest(
    groupsTypes.POST_CREATE_SCHEME_PERMISSION,
    postCreateSchemePermission,
  );
  yield takeLatest(groupsTypes.GET_GROUP_SCHEME, getGroupScheme);
  yield takeLatest(
    groupsTypes.GET_GROUP_SCHEME_ASSIGNMENTS,
    getGroupSchemeAssignments,
  );
  yield takeLatest(
    groupsTypes.PUT_GROUP_SCHEME_ASSIGNMENTS,
    putGroupSchemeAssignments,
  );
  yield takeLatest(groupsTypes.UPDATE_GROUP_SCHEME, updateGroupScheme);
  yield takeLatest(groupsTypes.GET_GROUP_DETAIL, getGroupDetail);
  yield takeLatest(groupsTypes.GET_GROUP_MEMBER, getGroupMembers);
  yield takeLatest(groupsTypes.GET_GROUP_SEARCH_MEMBERS, getGroupSearchMembers);
  yield takeLatest(groupsTypes.GET_GROUP_POSTS, getGroupPosts);
  yield takeLatest(groupsTypes.MERGE_EXTRA_GROUP_POSTS, mergeExtraGroupPosts);
  yield takeLatest(groupsTypes.EDIT_GROUP_DETAIL, editGroupDetail);
  yield takeLatest(groupsTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(groupsTypes.GET_JOINABLE_USERS, getJoinableUsers);
  yield takeLatest(
    groupsTypes.MERGE_EXTRA_JOINABLE_USERS,
    mergeExtraJoinableUsers,
  );
  yield takeLatest(groupsTypes.ADD_MEMBERS, addMembers);
  yield takeLatest(groupsTypes.JOIN_NEW_GROUP, joinNewGroup);
  yield takeLatest(groupsTypes.CANCEL_JOIN_GROUP, cancelJoinGroup);
  yield takeLatest(groupsTypes.GET_GROUP_SEARCH, getGroupSearch);
  yield takeLatest(groupsTypes.REMOVE_MEMBER, removeMember);
  yield takeLatest(groupsTypes.LEAVE_GROUP, leaveGroup);
  yield takeLatest(groupsTypes.SET_GROUP_ADMIN, setGroupAdmin);
  yield takeLatest(groupsTypes.REMOVE_GROUP_ADMIN, removeGroupAdmin);

  yield takeLatest(
    groupsTypes.GET_GROUP_MEMBER_REQUESTS,
    getGroupMemberRequests,
  );
  yield takeLatest(
    groupsTypes.APPROVE_SINGLE_GROUP_MEMBER_REQUEST,
    approveSingleGroupMemberRequest,
  );
  yield takeLatest(
    groupsTypes.APPROVE_ALL_GROUP_MEMBER_REQUESTS,
    approveAllGroupMemberRequests,
  );
  yield takeLatest(
    groupsTypes.DECLINE_SINGLE_GROUP_MEMBER_REQUEST,
    declineSingleGroupMemberRequest,
  );
  yield takeLatest(
    groupsTypes.DECLINE_ALL_GROUP_MEMBER_REQUESTS,
    declineAllGroupMemberRequests,
  );
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_SEARCH, getYourGroupsSearch);
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_TREE, getYourGroupsTree);
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_LIST, getYourGroupsList);
  yield takeLatest(groupsTypes.GET_JOINED_COMMUNITIES, getJoinedCommunities);
  yield takeLatest(groupsTypes.GET_MANAGED_COMMUNITIES, getManagedCommunities);
  yield takeLatest(
    groupsTypes.GET_DISCOVER_COMMUNITIES,
    getDiscoverCommunities,
  );
  yield takeLatest(groupsTypes.GET_COMMUNITY_GROUPS, getCommunityGroups);
  yield takeLatest(groupsTypes.GET_COMMUNITY_DETAIL, getCommunityDetail);
  yield takeLatest(groupsTypes.GET_COMMUNITY_MEMBERS, getCommunityMembers);
  yield takeLatest(
    groupsTypes.GET_COMMUNITY_SEARCH_MEMBERS,
    getCommunitySearchMembers,
  );
  yield takeLatest(groupsTypes.GET_DISCOVER_GROUPS, getDiscoverGroups);
  yield takeLatest(groupsTypes.JOIN_COMMUNITY, joinCommunity);
  yield takeLatest(groupsTypes.CANCEL_JOIN_COMMUNITY, cancelJoinCommunity);
  yield takeLatest(
    groupsTypes.GET_COMMUNITY_MEMBER_REQUESTS,
    getCommunityMemberRequests,
  );
  yield takeLatest(
    groupsTypes.APPROVE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    approveSingleCommunityMemberRequest,
  );
  yield takeLatest(
    groupsTypes.DECLINE_SINGLE_COMMUNITY_MEMBER_REQUEST,
    declineSingleCommunityMemberRequest,
  );
  yield takeLatest(
    groupsTypes.APPROVE_ALL_COMMUNITY_MEMBER_REQUESTS,
    approveAllCommunityMemberRequests,
  );
  yield takeLatest(
    groupsTypes.DECLINE_ALL_COMMUNITY_MEMBER_REQUESTS,
    declineAllCommunityMemberRequests,
  );
  yield takeLatest(groupsTypes.GET_COMMUNITY_SEARCH, getCommunitySearch);
  yield takeLatest(groupsTypes.EDIT_COMMUNITY_DETAIL, editCommunityDetail);
}

function* getGroupSearch({ payload }: {type: string; payload: string}) {
  try {
    yield put(groupsActions.setGroupSearch({ loading: true }));
    const params = { key: payload || '', discover: true };
    const response: AxiosResponse = yield groupsDataHelper.getSearchGroups(params);

    yield put(
      groupsActions.setGroupSearch({
        result: response.data || [],
        loading: false,
      }),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (response.code != 200 && response.code?.toUpperCase?.() !== 'OK') {
      console.error(`\x1b[31m🐣️ saga getGroupSearch error: ${response}\x1b[0m`);
    }
  } catch (err) {
    console.error(`\x1b[31m🐣️ saga getGroupSearch error: ${err}\x1b[0m`);
    yield put(groupsActions.setGroupSearch({ loading: false, result: [] }));
    // yield showError(err);
  }
}

function* uploadImage({ payload }: {type: string; payload: IGroupImageUpload}) {
  try {
    const {
      file, id, fieldName, uploadType, destination,
    } = payload;
    yield updateLoadingImageState(fieldName, true);

    const data: IGetFile = yield ImageUploader.getInstance().upload({
      file,
      uploadType,
    });

    if (destination === 'group') {
      yield put(
        groupsActions.editGroupDetail({
          data: { id, [fieldName]: data.url },
          editFieldName:
            fieldName === 'icon'
              ? i18next.t('common:text_avatar')
              : i18next.t('common:text_cover'),
        }),
      );
    } else {
      yield put(
        groupsActions.editCommunityDetail({
          data: { id, [fieldName]: data.url },
          editFieldName:
            fieldName === 'icon'
              ? i18next.t('common:text_avatar')
              : i18next.t('common:text_cover'),
        }),
      );
    }
  } catch (err) {
    console.error('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    yield updateLoadingImageState(payload.fieldName, false);
    yield showError(err);
  }
}

function* getJoinableUsers({
  payload,
}: {
  type: string;
  payload: IGroupGetJoinableMembers;
}) {
  try {
    const { groups } = yield select();
    const { offset, data } = groups.users;

    const { groupId, params } = payload;
    const response: IResponseData = yield groupsDataHelper.getJoinableUsers(
      groupId,
      { offset, limit: appConfig.recordsPerPage, ...params },
    );
    const result = mapData(response.data);

    if (data.length === 0) {
      yield put(groupsActions.setJoinableUsers(result));
      if (result.length === appConfig.recordsPerPage) {
        yield put(groupsActions.getJoinableUsers(payload));
      }
    } else {
      yield put(groupsActions.setExtraJoinableUsers(result));
    }
  } catch (err) {
    console.error(
      '\x1b[33m',
      'getUsers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
}

function* mergeExtraJoinableUsers() {
  const { groups } = yield select();
  const { canLoadMore, loading, params } = groups.users;
  const { id: groupId } = groups?.groupDetail?.group || {};
  if (!loading && canLoadMore) {
    yield put(groupsActions.getJoinableUsers({ groupId, params }));
  }
}

function* addMembers({ payload }: {type: string; payload: IGroupAddMembers}) {
  try {
    const { groupId, userIds } = payload;

    yield groupsDataHelper.addUsers(groupId, userIds);

    // refresh group detail after adding new members
    yield refreshGroupMembers(groupId);

    const userAddedCount = userIds.length;

    const toastMessage: IToastMessage = {
      content: i18next
        .t(
          `common:message_add_member_success:${
            userAddedCount > 1 ? 'many' : '1'
          }`,
        )
        .replace('{n}', userAddedCount.toString()),
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    navigation.navigate(groupStack.groupMembers, { groupId });
  } catch (err) {
    console.error(
      '\x1b[33m',
      'addMembers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
    yield showError(err);
  }
}

function* cancelJoinGroup({
  payload,
}: {
  type: string;
  payload: {groupId: string; groupName: string};
}) {
  try {
    const { groupId, groupName } = payload;

    yield call(groupsDataHelper.cancelJoinGroup, groupId);

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({
        id: groupId,
        data: { joinStatus: groupJoinStatus.visitor },
      }),
    );

    yield put(groupsActions.getGroupDetail(groupId));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_cancel_join_group')} ${groupName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('cancelJoinGroup catch', err);

    if (
      err?.meta?.message
      === 'You have been approved to be a member of this group'
    ) {
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_approved_member_group')}`,
        props: {
          type: 'error',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
      yield put(groupsActions.getGroupDetail(payload.groupId, true));

      return;
    }

    yield call(showError, err);
  }
}

function* updateLoadingImageState(
  fieldName: 'icon' | 'backgroundImgUrl',
  value: boolean,
) {
  if (fieldName === 'icon') {
    yield put(groupsActions.setLoadingAvatar(value));
  } else {
    yield put(groupsActions.setLoadingCover(value));
  }
}

export function* refreshGroupMembers(groupId: string) {
  yield put(groupsActions.clearGroupMembers());
  yield put(groupsActions.getGroupMembers({ groupId }));
  yield put(groupsActions.getGroupDetail(groupId));
}
