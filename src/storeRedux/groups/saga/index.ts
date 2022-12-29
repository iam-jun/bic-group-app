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
import { IResponseData, IToastMessage } from '~/interfaces/common';
import { mapData } from '~/screens/groups/helper/mapper';
import appConfig from '~/configs/appConfig';
import ImageUploader, { IGetFile } from '~/services/imageUploader';

import getGroupSearchMembers from './getGroupSearchMembers';
import approveAllGroupMemberRequests from './approveAllGroupMemberRequests';
import declineAllGroupMemberRequests from './declineAllGroupMemberRequests';
import approveSingleGroupMemberRequest from './approveSingleGroupMemberRequest';
import declineSingleGroupMemberRequest from './declineSingleGroupMemberRequest';
import getGroupMemberRequests from './getGroupMemberRequests';
import getGlobalSearch from './getGlobalSearch';
import { IUser } from '~/interfaces/IAuth';
import useCommunityController from '~/screens/communities/store';
import useGroupController from '~/screens/groups/store';
import useGroupMemberStore from '~/screens/groups/GroupMembers/store';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useGeneralInformationStore from '~/screens/groups/GeneralInformation/store';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToastError from '~/store/helper/showToastError';

export default function* groupsSaga() {
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
    showToastError(err);
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
    showToastError(error);
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
    const { id: groupId } = useGroupDetailStore.getState().groupDetail.group;
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
      type: ToastType.SUCCESS,
    };
    useModalStore.getState().actions.showToast(toastMessage);
  } catch (error) {
    console.error('addMembers error:', error);
    showToastError(error);
  }
}

function updateLoadingImageState(
  fieldName: 'icon' | 'backgroundImgUrl',
  value: boolean,
) {
  const { setLoadingAvatar, setLoadingCover } = useGeneralInformationStore.getState().actions;
  if (fieldName === 'icon') {
    setLoadingAvatar(value);
  } else {
    setLoadingCover(value);
  }
}

export function refreshGroupMembers(groupId: string) {
  useGroupMemberStore.getState().actions.getGroupMembers({ groupId, isRefreshing: true });
  useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
}
