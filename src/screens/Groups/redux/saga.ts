import {AxiosResponse} from 'axios';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import i18next from 'i18next';

import {IGroup, IGroupDetailEdit, IGroupImageUpload} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IResponseData} from '~/interfaces/common';

export default function* groupsSaga() {
  yield takeLatest(groupsTypes.GET_JOINED_GROUPS, getJoinedGroups);
  yield takeLatest(groupsTypes.GET_GROUP_DETAIL, getGroupDetail);
  yield takeLatest(groupsTypes.GET_GROUP_MEMBER, getGroupMember);
  yield takeLatest(groupsTypes.GET_GROUP_POSTS, getGroupPosts);
  yield takeLatest(groupsTypes.SELECT_GROUP_DETAIL, selectGroupDetail);
  yield takeLatest(groupsTypes.EDIT_GROUP_DETAIL, editGroupDetail);
  yield takeLatest(groupsTypes.UPLOAD_IMAGE, uploadImage);
}

function* getJoinedGroups() {
  try {
    yield put(groupsActions.setLoadingJoinedGroups(true));

    const result = yield requestJoinedGroups();

    yield put(groupsActions.setJoinedGroups(result));
    yield put(groupsActions.setLoadingJoinedGroups(false));
  } catch (e) {
    yield put(groupsActions.setLoadingJoinedGroups(false));
    console.log(
      '\x1b[33m',
      'namanh --- getJoinedGroups | getJoinedGroups : error',
      e,
      '\x1b[0m',
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

function* getGroupMember({payload}: {type: string; payload: number}) {
  try {
    const groupMembers: any = yield select(state => state?.groups?.groupMember);
    const newGroupMembers = Object.assign({}, groupMembers || {});
    const {skip = 0, take = 20, canLoadMore = true} = newGroupMembers;
    if (canLoadMore) {
      const response = yield call(
        groupsDataHelper.getGroupMembers,
        payload,
        skip,
        take,
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
    yield put(groupsActions.getGroupPosts(payload.id));
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

const getGroupChild = (
  item: any,
  array: IGroup[],
  parent: any | undefined,
  path: string,
) => {
  if (parent) {
    item.parent = {id: parent.id, name: parent.name, parent: parent.parent};
    path = `${path}${parent.name}/`;
    item.path = path;
  }
  array.push(item);
  if (item.children && item.children.length > 0) {
    item.children.map((child: IGroup) =>
      getGroupChild(child, array, item, path),
    );
  }
};

function* getGroupPosts({payload}: {type: string; payload: number}) {
  try {
    yield put(groupsActions.setLoadingGroupPosts(true));

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

const requestJoinedGroups = async () => {
  try {
    const response = await groupsDataHelper.getMyGroups();
    if (response.code === 200 && response.data?.length > 0) {
      const originGroups = response.data;
      const groups: IGroup[] = [];
      originGroups.map((item: any) =>
        getGroupChild(item, groups, undefined, '/'),
      );

      return groups;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'namanh --- getMygroups | getMygroups catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};

const requestGroupPosts = async (userId: number) => {
  try {
    const response = await groupsDataHelper.getMyGroupPosts(userId);
    if (response.code === 200 && response.data?.length > 0) {
      return response.data;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'namanh --- getMyGroupPosts | getMyGroupPosts catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};

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
    formData.append('file', {
      type: image.type,
      // @ts-ignore
      name: image.name || 'fileMessage',
      uri: image.uri,
    });
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
