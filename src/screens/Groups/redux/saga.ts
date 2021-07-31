import {put, takeLatest} from 'redux-saga/effects';
import {IGroup, IGroupDetail} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import mockGetGroupDetail from '~/screens/Groups/mocks/getGroupDetail';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';

export default function* groupsSaga() {
  yield takeLatest(groupsTypes.GET_JOINED_GROUPS, getJoinedGroups);
  yield takeLatest(groupsTypes.GET_GROUP_DETAIL, getGroupDetail);
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

const getGroupChild = (item: any, array: IGroup[], parent: any | undefined) => {
  if (parent) {
    item.parent = {id: parent.id, name: parent.name, parent: parent.parent};
  }
  array.push(item);
  if (item.children && item.children.length > 0) {
    item.children.map((child: IGroup) => getGroupChild(child, array, item));
  }
};

const requestGroupDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    //todo call api
    setTimeout(() => {
      const response = mockGetGroupDetail;
      if (response.code === 200 && response.data) {
        const groupDetail: IGroupDetail = response.data;
        resolve(groupDetail);
      } else {
        reject(response);
      }
    }, 1000);
  });
};

const requestJoinedGroups = async () => {
  try {
    const response = await groupsDataHelper.getMyGroups();
    if (response.code === 200 && response.data?.length > 0) {
      const originGroups = response.data;
      const groups: IGroup[] = [];
      originGroups.map((item: any) => getGroupChild(item, groups, undefined));

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
