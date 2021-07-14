import {all, put, call, takeLatest, select} from 'redux-saga/effects';
import groupsTypes from "~/screens/Groups/redux/types";
import groupsActions from "~/screens/Groups/redux/actions";
import mockGetJoinedGroups from "~/screens/Groups/mocks/getJoinedGroups";
import {IGroup, IGroupDetail} from "~/interfaces/IGroup";
import mockGetGroupDetail from "~/screens/Groups/mocks/getGroupDetail";

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
        console.log('\x1b[33m','namanh --- getJoinedGroups | getJoinedGroups : error', e,'\x1b[0m')
    }
}

function* getGroupDetail({payload}: { type: string; payload: number }) {
    try {
        yield put(groupsActions.setLoadingGroupDetail(true));

        const result = yield requestGroupDetail(payload);
        yield put(groupsActions.setGroupDetail(result));
        yield put(groupsActions.setLoadingGroupDetail(false));
    } catch (e) {
        yield put(groupsActions.setLoadingGroupDetail(false));
        console.log('\x1b[36m','namanh --- getGroupDetail | getGroupDetail : error', e,'\x1b[0m')
    }
}

const getGroupChild = (item: any, array:IGroup[], parent: any | undefined) => {
    if (parent) {
        item.parent = {id: parent.id, name: parent.name, parent: parent.parent};
    }
    array.push(item);
    if (item.children && item.children.length > 0) {
        item.children.map((child:IGroup) => getGroupChild(child, array, item));
    }
};

const requestGroupDetail = (id:number) => {
    return new Promise((resolve, reject) => {
        //todo call api
        setTimeout(() => {
            const response = mockGetGroupDetail;
            if (response.code === 200 && response.data) {
                const groupDetail: IGroupDetail = response.data;
                resolve(groupDetail);
            } else {
                reject(response)
            }
        }, 1000);
    });
}

const requestJoinedGroups = () => {
    return new Promise((resolve, reject) => {
        //todo call api
        setTimeout(() => {
            const response = mockGetJoinedGroups;
            if (response.code === 200 && response.data?.length > 0) {
                const originGroups = response.data;
                const groups: IGroup[] = [];
                originGroups.map(item => getGroupChild(item, groups, undefined));

                resolve(groups);
            } else {
                reject(response)
            }
        }, 1000);
    });
};
