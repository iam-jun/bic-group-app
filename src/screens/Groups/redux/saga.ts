import i18next from 'i18next';
import {put, select, takeLatest} from 'redux-saga/effects';

import {
  IGroupAddMembers,
  IGroupDetailEdit,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupImageUpload,
  IPayloadGetGroupPost,
} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import {mapData} from '../helper/mapper';
import appConfig from '~/configs/appConfig';
import FileUploader from '~/services/fileUploader';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';

export default function* groupsSaga() {
  yield takeLatest(groupsTypes.GET_JOINED_GROUPS, getJoinedGroups);
  yield takeLatest(groupsTypes.GET_GROUP_DETAIL, getGroupDetail);
  yield takeLatest(groupsTypes.GET_GROUP_MEMBER, getGroupMember);
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
}

function* getJoinedGroups({payload}: {type: string; payload?: any}) {
  try {
    // @ts-ignore
    const response = yield groupsDataHelper.getMyGroups(payload?.params);
    yield put(groupsActions.setJoinedGroups(response.data));
  } catch (e) {
    yield put(groupsActions.setJoinedGroups([]));
    console.log(
      `\x1b[31m🐣️ saga getJoinedGroups`,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
  }
}

function* getGroupDetail({payload}: {type: string; payload: number}) {
  try {
    const result = yield requestGroupDetail(payload);
    yield put(groupsActions.setGroupDetail(result));

    const {groups} = yield select();
    const join_status = groups?.groupDetail?.join_status;
    const isMember = join_status === groupJoinStatus.member;

    const privacy = groups?.groupDetail?.group?.privacy;
    const isPublic = privacy === groupPrivacy.public;

    if (!isMember && !isPublic) yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    console.log('[getGroupDetail]', e);
    yield put(groupsActions.setLoadingPage(false));
    yield put(groupsActions.setGroupDetail(null));
  }
}

function* editGroupDetail({
  payload,
}: {
  type: string;
  payload: IGroupDetailEdit;
}) {
  try {
    // @ts-ignore
    const result = yield requestEditGroupDetail(payload);

    // checking if uploading avatar/cover image
    // to use different toast message content
    const {icon, background_img_url} = payload;
    let toastContent: string;

    if (!!icon) {
      toastContent = 'common:avatar_changed';
    } else if (!!background_img_url) {
      toastContent = 'common:cover_changed';
    } else {
      toastContent = 'common:text_edit_success';
    }

    const toastMessage: IToastMessage = {
      content: toastContent,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    yield put(groupsActions.setGroupDetail(result));
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield showError(err);
    // just in case there is some error regarding editing images url
    yield put(groupsActions.setLoadingAvatar(false));
    yield put(groupsActions.setLoadingCover(false));
  }
}

function* getGroupMember({payload}: {type: string; payload: IGroupGetMembers}) {
  try {
    yield put(groupsActions.setLoadingGroupMembers(true));
    const {groupId, params} = payload;

    const {groups} = yield select();
    const {groupMember} = groups;
    const newGroupMembers = Object.assign({}, groupMember || {});
    const {skip = 0, canLoadMore = true} = newGroupMembers;
    if (canLoadMore) {
      const response: IResponseData = yield groupsDataHelper.getGroupMembers(
        groupId,
        {
          offset: skip,
          limit: appConfig.recordsPerPage,
          ...params,
        },
      );

      let newSkip = skip;
      let newCanLoadMore = canLoadMore;
      if (response) {
        Object.keys(response)?.map?.((role: any) => {
          newSkip = newSkip + response?.[role]?.data?.length || 0;
          if (newGroupMembers?.[role]) {
            const roleData = {...newGroupMembers[role]};
            newGroupMembers[role].data = roleData.data?.concat(
              response?.[role]?.data || [],
            );
          } else {
            newGroupMembers[role] = response?.[role];
          }
          newGroupMembers.skip = newSkip;
        });
        if (newSkip === skip) {
          newCanLoadMore = false;
        }
        newGroupMembers.canLoadMore = newCanLoadMore;
        yield put(groupsActions.setGroupMembers(newGroupMembers));
      }
    }
    yield put(groupsActions.setLoadingGroupMembers(false));
  } catch (e) {
    console.log(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${e} \x1b[0m`);
  }
}

function* getGroupPosts({
  payload,
}: {
  type: string;
  payload: IPayloadGetGroupPost;
}) {
  try {
    const {groups} = yield select();
    const {offset, data} = groups.posts;

    const {userId, groupId, streamClient} = payload;
    // @ts-ignore
    const result = yield groupsDataHelper.getMyGroupPosts(
      userId,
      groupId,
      streamClient,
      offset,
    );

    if (data.length === 0) {
      yield put(postActions.addToAllPosts(result));
      yield put(groupsActions.setGroupPosts(result));
      if (result.length === appConfig.recordsPerPage) {
        yield put(groupsActions.getGroupPosts(payload));
      }
    } else {
      yield put(postActions.addToAllPosts(result));
      yield put(groupsActions.setExtraGroupPosts(result));
    }

    yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    yield put(groupsActions.setLoadingPage(false));
    console.log(
      '\x1b[33m',
      'namanh --- getGroupPosts | getGroupPosts : error',
      e,
      '\x1b[0m',
    );
  }
}

function* mergeExtraGroupPosts({
  payload,
}: {
  type: string;
  payload: IPayloadGetGroupPost;
}) {
  const {groups} = yield select();
  const {canLoadMore, loading} = groups.posts;
  if (!loading && canLoadMore) {
    const {userId, groupId, streamClient} = payload;
    yield put(groupsActions.getGroupPosts({streamClient, groupId, userId}));
  }
}

const requestGroupDetail = async (userId: number) => {
  const response = await groupsDataHelper.getGroupDetail(userId);
  if (response.code === 200) {
    return response.data;
  }

  throw new Error('Error when fetching group detail');
};

const requestEditGroupDetail = async (data: IGroupDetailEdit) => {
  const groupId = data.id;
  delete data.id; // edit data should not contain group's id

  // @ts-ignore
  const response = await groupsDataHelper.editGroupDetail(groupId, data);

  return response.data;
};

function* uploadImage({payload}: {type: string; payload: IGroupImageUpload}) {
  try {
    const {file, id, fieldName, uploadType} = payload;
    yield updateLoadingImageState(fieldName, true);

    const data: string = yield FileUploader.getInstance().upload({
      file,
      uploadType,
    });

    yield put(groupsActions.editGroupDetail({id, [fieldName]: data}));
  } catch (err) {
    console.log('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
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
    const {groups} = yield select();
    const {offset, data} = groups.users;

    const {groupId, params} = payload;
    const response: IResponseData = yield groupsDataHelper.getJoinableUsers(
      groupId,
      {offset, limit: appConfig.recordsPerPage, ...params},
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
    console.log(
      '\x1b[33m',
      'getUsers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
}

function* mergeExtraJoinableUsers() {
  const {groups} = yield select();
  const {canLoadMore, loading, params} = groups.users;
  const {id: groupId} = groups?.groupDetail?.group;
  if (!loading && canLoadMore) {
    yield put(groupsActions.getJoinableUsers({groupId, params}));
  }
}

function* addMembers({payload}: {type: string; payload: IGroupAddMembers}) {
  try {
    const {groupId, userIds} = payload;

    yield groupsDataHelper.addUsers(groupId, userIds);

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
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log(
      '\x1b[33m',
      'addMembers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
    yield showError(err);
  }
}

function* showError(err: any) {
  const toastMessage: IToastMessage = {
    content:
      err?.meta?.message ||
      err?.meta?.errors?.[0]?.message ||
      'common:text_error_message',
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(modalActions.showHideToastMessage(toastMessage));
}

function* updateLoadingImageState(
  fieldName: 'icon' | 'background_img_url',
  value: boolean,
) {
  if (fieldName === 'icon') {
    yield put(groupsActions.setLoadingAvatar(value));
  } else {
    yield put(groupsActions.setLoadingCover(value));
  }
}
