import i18next from 'i18next';
import {Platform} from 'react-native';
import {put, select, takeLatest} from 'redux-saga/effects';

import {
  IGroup,
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
import {IResponseData} from '~/interfaces/common';
import {mapData} from '../helper/mapper';
import appConfig from '~/configs/appConfig';

export default function* groupsSaga() {
  yield takeLatest(groupsTypes.GET_JOINED_GROUPS, getJoinedGroups);
  yield takeLatest(groupsTypes.GET_GROUP_DETAIL, getGroupDetail);
  yield takeLatest(groupsTypes.GET_GROUP_MEMBER, getGroupMember);
  yield takeLatest(groupsTypes.GET_GROUP_POSTS, getGroupPosts);
  yield takeLatest(groupsTypes.SELECT_GROUP_DETAIL, selectGroupDetail);
  yield takeLatest(groupsTypes.EDIT_GROUP_DETAIL, editGroupDetail);
  yield takeLatest(groupsTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(groupsTypes.GET_JOINABLE_USERS, getJoinableUsers);
  yield takeLatest(
    groupsTypes.MERGE_EXTRA_JOINABLE_USERS,
    mergeExtraJoinableUsers,
  );
  yield takeLatest(groupsTypes.ADD_MEMBERS, addMembers);
}

function* getJoinedGroups() {
  try {
    yield put(groupsActions.setLoadingJoinedGroups(true));
    const response = yield groupsDataHelper.getMyGroups();
    if (response.data?.length > 0) {
      yield put(groupsActions.setJoinedGroups(response.data));
      yield put(groupsActions.setLoadingJoinedGroups(false));
    }
    yield put(groupsActions.setLoadingJoinedGroups(false));
  } catch (e) {
    yield put(groupsActions.setLoadingJoinedGroups(false));
    console.log(
      `\x1b[31m🐣️ saga getJoinedGroups`,
      `${JSON.stringify(e, undefined, 2)}\x1b[0m`,
    );
  }
}

function* getGroupDetail({payload}: {type: string; payload: number}) {
  try {
    yield put(groupsActions.setLoadingGroupDetail(true));

    const result = yield requestGroupDetail(payload);
    yield put(groupsActions.setGroupDetail(result));

    yield put(groupsActions.setLoadingGroupDetail(false));
  } catch (e) {
    yield put(groupsActions.setLoadingGroupDetail(false));
    console.log(
      '\x1b[36m',
      'namanh --- getGroupDetail | getGroupDetail : error',
      e,
      '\x1b[0m',
    );
  }
}

function* editGroupDetail({
  payload,
}: {
  type: string;
  payload: IGroupDetailEdit;
}) {
  try {
    const result = yield requestEditGroupDetail(payload);
    yield put(groupsActions.setGroupDetail(result));
  } catch (error) {
    console.log('\x1b[33m', 'editGroupDetail : error', error, '\x1b[0m');
  }
}

function* getGroupMember({payload}: {type: string; payload: IGroupGetMembers}) {
  try {
    const {groupId, params} = payload;

    const {groups} = yield select();
    const {groupMembers} = groups;
    const newGroupMembers = Object.assign({}, groupMembers || {});
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
  } catch (e) {
    console.log(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${e} \x1b[0m`);
  }
}

function* selectGroupDetail({payload}: {type: string; payload: IGroup}) {
  try {
    yield put(groupsActions.setLoadingGroupPosts(true));

    // GET MORE INFO FOR GROUP HERE
    yield put(groupsActions.getGroupDetail(payload.id));

    yield put(groupsActions.setLoadingGroupDetail(false));
  } catch (error) {
    console.log(
      '\x1b[33m',
      'khanh --- selectGroupDetail | selectGroupDetail : error',
      error,
      '\x1b[0m',
    );
  }
}

function* getGroupPosts({
  payload,
}: {
  type: string;
  payload: IPayloadGetGroupPost;
}) {
  try {
    yield put(groupsActions.setLoadingGroupPosts(true));

    // @ts-ignore
    const result = yield requestGroupPosts(payload);
    yield put(postActions.addToAllPosts(result));
    yield put(groupsActions.setGroupPosts(result));
    yield put(groupsActions.setLoadingGroupPosts(false));
  } catch (e) {
    yield put(groupsActions.setLoadingGroupPosts(false));
    console.log(
      '\x1b[33m',
      'namanh --- getGroupPosts | getGroupPosts : error',
      e,
      '\x1b[0m',
    );
  }
}

const requestGroupDetail = async (userId: number) => {
  try {
    const response = await groupsDataHelper.getGroupDetail(userId);
    if (response.code === 200) {
      return response.data;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'requestGroupDetail catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};

function* requestGroupPosts(payload: IPayloadGetGroupPost) {
  try {
    const {userId, groupId, streamClient} = payload;
    const result: unknown = yield groupsDataHelper.getMyGroupPosts(
      userId,
      groupId,
      streamClient,
    );
    return result;
  } catch (err) {
    console.log(
      '\x1b[33m',
      'requestGroupPosts catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
}

const requestEditGroupDetail = async (data: IGroupDetailEdit) => {
  try {
    const groupId = data.id;
    delete data.id; // edit data should not contain group's id

    const response = await groupsDataHelper.editGroupDetail(groupId, data);
    if (response.code === 200) {
      return response.data;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'requestEditGroupDetail catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};

function* uploadImage({payload}: {type: string; payload: IGroupImageUpload}) {
  try {
    const {image, id, fieldName} = payload;

    const formData = new FormData();
    if (Platform.OS === 'web') {
      formData.append(
        'file',
        // @ts-ignore
        payload.image,
        payload.image.name || 'imageName',
      );
    } else {
      formData.append('file', {
        type: image.type,
        // @ts-ignore
        name: image.name || 'imageName',
        uri: image.uri,
      });
    }
    const response: IResponseData = yield groupsDataHelper.uploadImage(
      formData,
    );
    yield put(
      groupsActions.editGroupDetail({id, [fieldName]: response?.data?.src}),
    );
  } catch (err) {
    console.log('\x1b[33m', 'uploadImage : error', err, '\x1b[0m');
    yield put(
      modalActions.showAlert({
        title: err?.meta?.errors?.[0]?.title || i18next.t('common:text_error'),
        content:
          err?.meta?.errors?.[0]?.message ||
          i18next.t('common:text_error_message'),
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
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
    yield put(groupsActions.setAddMembersMessage(userAddedCount));
  } catch (err) {
    console.log(
      '\x1b[33m',
      'addMembers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
    yield put(
      modalActions.showAlert({
        title: err?.meta?.errors?.[0]?.title || i18next.t('common:text_error'),
        content: err?.meta?.message || i18next.t('common:text_error_message'),
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}
