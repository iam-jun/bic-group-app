import i18next from 'i18next';
import {
  call, put, select, takeLatest,
} from 'redux-saga/effects';

import {
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupImageUpload,
} from '~/interfaces/IGroup';
import groupApi from '~/api/GroupApi';
import groupsActions from '~/storeRedux/groups/actions';
import groupsTypes from '~/storeRedux/groups/types';
import * as modalActions from '~/storeRedux/modal/actions';
import { IResponseData, IToastMessage } from '~/interfaces/common';
import { mapData } from '~/screens/groups/helper/mapper';
import appConfig from '~/configs/appConfig';
import ImageUploader, { IGetFile } from '~/services/imageUploader';

import getGroupDetail from './getGroupDetail';
import showError from '~/storeRedux/commonSaga/showError';
import getCommunityMembers from './getCommunityMembers';
import getCommunitySearchMembers from './getCommunitySearchMembers';
import getGroupSearchMembers from './getGroupSearchMembers';
import getCommunityMemberRequests from './getCommunityMemberRequests';
import approveSingleCommunityMemberRequest from './approveSingleCommunityMemberRequest';
import declineSingleCommunityMemberRequest from './declineSingleCommunityMemberRequest';
import approveAllCommunityMemberRequests from './approveAllCommunityMemberRequests';
import declineAllCommunityMemberRequests from './declineAllCommunityMemberRequests';
import approveAllGroupMemberRequests from './approveAllGroupMemberRequests';
import declineAllGroupMemberRequests from './declineAllGroupMemberRequests';
import approveSingleGroupMemberRequest from './approveSingleGroupMemberRequest';
import declineSingleGroupMemberRequest from './declineSingleGroupMemberRequest';
import getGroupMemberRequests from './getGroupMemberRequests';
import getMyPermissions from './getMyPermissions';
import updateGroupJoinSetting from './updateGroupJoinSetting';
import getGlobalSearch from './getGlobalSearch';
import { IUser } from '~/interfaces/IAuth';
import useCommunityController from '~/screens/communities/store';
import useGroupController from '~/screens/groups/store';
import useGroupMemberStore from '~/screens/groups/GroupMembers/store';

export default function* groupsSaga() {
  yield takeLatest(
    groupsTypes.UPDATE_GROUP_JOIN_SETTING, updateGroupJoinSetting,
  );
  yield takeLatest(
    groupsTypes.GET_MY_PERMISSIONS, getMyPermissions,
  );
  yield takeLatest(
    groupsTypes.GET_GROUP_DETAIL, getGroupDetail,
  );
  yield takeLatest(
    groupsTypes.GET_GROUP_SEARCH_MEMBERS, getGroupSearchMembers,
  );
  yield takeLatest(
    groupsTypes.UPLOAD_IMAGE, uploadImage,
  );
  yield takeLatest(
    groupsTypes.GET_JOINABLE_USERS, getJoinableUsers,
  );
  yield takeLatest(
    groupsTypes.MERGE_EXTRA_JOINABLE_USERS,
    mergeExtraJoinableUsers,
  );
  yield takeLatest(
    groupsTypes.ADD_MEMBERS, addMembers,
  );

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
  yield takeLatest(
    groupsTypes.GET_COMMUNITY_MEMBERS, getCommunityMembers,
  );
  yield takeLatest(
    groupsTypes.GET_COMMUNITY_SEARCH_MEMBERS,
    getCommunitySearchMembers,
  );
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
  yield takeLatest(
    groupsTypes.GET_GLOBAL_SEARCH, getGlobalSearch,
  );
}

function* uploadImage({ payload }: {type: string; payload: IGroupImageUpload}) {
  try {
    const {
      file, id, fieldName, uploadType, destination, rootGroupId,
    } = payload;

    const { actions } = useCommunityController.getState();

    yield updateLoadingImageState(
      fieldName, true,
    );

    const data: IGetFile = yield ImageUploader.getInstance().upload({
      file,
      uploadType,
    });

    const editData = { id, rootGroupId, [fieldName]: data.url };
    const editFieldName = fieldName === 'icon'
      ? i18next.t('common:text_avatar')
      : i18next.t('common:text_cover');

    if (destination === 'group') {
      useGroupController.getState().actions.editGroupDetail(editData, editFieldName);
    } else {
      actions.editCommunityDetail(editData, editFieldName);
    }
    yield updateLoadingImageState(
      payload.fieldName, false,
    );
  } catch (err) {
    console.error(
      '\x1b[33m', 'uploadImage : error', err, '\x1b[0m',
    );
    yield updateLoadingImageState(
      payload.fieldName, false,
    );
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
    const { data, extra } = groups.users;

    yield put(groupsActions.setJoinableUsers({ loading: data.length === 0 }));

    const { groupId, params } = payload;
    const response: IResponseData = yield call(
      groupApi.getJoinableUsers,
      groupId,
      {
        offset: data.length + extra.length,
        limit: appConfig.recordsPerPage,
        ...params,
      },
    );
    const result = mapData(response.data);
    const canLoadMore = result.length === appConfig.recordsPerPage;

    if (data.length === 0) {
      yield put(groupsActions.setJoinableUsers({
        loading: false,
        data: result,
        canLoadMore,
        params,
      }));

      // load more data in advance if possible
      if (canLoadMore) {
        yield put(groupsActions.getJoinableUsers(payload));
      }
    } else {
      // store load more data to future merge, avoid waiting from API
      yield put(groupsActions.setExtraJoinableUsers({
        extra: result,
        canLoadMore,
      }));
    }
  } catch (error) {
    console.error('getJoinableUsers error:', error);
    yield call(showError, error);
  }
}

function* mergeExtraJoinableUsers() {
  const { groups } = yield select();
  const {
    data, extra, canLoadMore, loading, params,
  } = groups.users;

  if (extra.length === 0) return;

  yield put(groupsActions.setMergeExtraJoinableUsers({
    data: [...data, ...extra],
    extra: [],
  }));

  if (!loading && canLoadMore) {
    // continue to load more data in advance if possible
    const { id: groupId } = groups?.groupDetail?.group || {};
    if (groupId) {
      yield put(groupsActions.getJoinableUsers({ groupId, params }));
    }
  }
}

function* addMembers({ payload }: {type: string; payload: IGroupAddMembers}) {
  try {
    const { groups } = yield select();
    const { data: joinableUsers } = groups.users;
    const { selectedUsers } = groups;

    const { groupId } = payload;
    const selectedUserIds = selectedUsers.map((user: IUser) => user.id);
    yield call(groupApi.addUsers, groupId, selectedUserIds);

    // removed added users from current joinable user list
    const newUpdatedJoinableUsers = joinableUsers.filter(
      (user: IUser) => !selectedUserIds.includes(user.id),
    );
    yield put(groupsActions.setJoinableUsers({
      data: newUpdatedJoinableUsers,
    }));

    yield put(groupsActions.clearSelectedUsers());

    // refresh group detail after adding new members
    yield refreshGroupMembers(groupId);

    const toastMessage: IToastMessage = {
      content: i18next.t('common:message_add_member_success_group'),
      props: { type: 'success' },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('addMembers error:', error);
    yield call(showError, error);
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
  useGroupMemberStore.getState().actions.getGroupMembers({ groupId, isRefreshing: true });
  yield put(groupsActions.getGroupDetail({ groupId }));
}
