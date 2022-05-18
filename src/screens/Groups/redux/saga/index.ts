import i18next from 'i18next';
import {put, select, takeLatest} from 'redux-saga/effects';

import {
  IGroupAddMembers,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupImageUpload,
  IJoiningMember,
} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';
import * as modalActions from '~/store/modal/actions';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import {mapData, mapItems} from '../../helper/mapper';
import appConfig from '~/configs/appConfig';
import FileUploader, {IGetFile} from '~/services/fileUploader';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import memberRequestStatus from '~/constants/memberRequestStatus';
import approveDeclineCode from '~/constants/approveDeclineCode';

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

const navigation = withNavigation(rootNavigationRef);

export default function* groupsSaga() {
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
  yield takeLatest(groupsTypes.JOIN_NEW_GROUP, joinNewGroup);
  yield takeLatest(groupsTypes.CANCEL_JOIN_GROUP, cancelJoinGroup);
  yield takeLatest(groupsTypes.GET_GROUP_SEARCH, getGroupSearch);
  yield takeLatest(groupsTypes.REMOVE_MEMBER, removeMember);
  yield takeLatest(groupsTypes.LEAVE_GROUP, leaveGroup);
  yield takeLatest(groupsTypes.SET_GROUP_ADMIN, setGroupAdmin);
  yield takeLatest(groupsTypes.REMOVE_GROUP_ADMIN, removeGroupAdmin);

  yield takeLatest(groupsTypes.GET_MEMBER_REQUESTS, getMemberRequests);
  yield takeLatest(
    groupsTypes.APPROVE_SINGLE_MEMBER_REQUEST,
    approveSingleMemberRequest,
  );
  yield takeLatest(
    groupsTypes.APPROVE_ALL_MEMBER_REQUESTS,
    approveAllMemberRequests,
  );
  yield takeLatest(
    groupsTypes.DECLINE_SINGLE_MEMBER_REQUEST,
    declineSingleMemberRequest,
  );
  yield takeLatest(
    groupsTypes.DECLINE_ALL_MEMBER_REQUESTS,
    declineAllMemberRequests,
  );
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_SEARCH, getYourGroupsSearch);
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_TREE, getYourGroupsTree);
  yield takeLatest(groupsTypes.GET_YOUR_GROUPS_LIST, getYourGroupsList);
  yield takeLatest(groupsTypes.GET_JOINED_COMMUNITIES, getJoinedCommunities);
  yield takeLatest(
    groupsTypes.GET_DISCOVER_COMMUNITIES,
    getDiscoverCommunities,
  );
  yield takeLatest(groupsTypes.GET_COMMUNITY_GROUPS, getCommunityGroups);
  yield takeLatest(groupsTypes.GET_COMMUNITY_DETAIL, getCommunityDetail);
  yield takeLatest(groupsTypes.GET_COMMUNITY_MEMBERS, getCommunityMembers);
  yield takeLatest(groupsTypes.GET_DISCOVER_GROUPS, getDiscoverGroups);
}

function* getGroupSearch({payload}: {type: string; payload: string}) {
  try {
    yield put(groupsActions.setGroupSearch({loading: true}));
    const params = {key: payload || '', discover: true};
    // @ts-ignore
    const response = yield groupsDataHelper.getSearchGroups(params);

    yield put(
      groupsActions.setGroupSearch({
        result: response.data || [],
        loading: false,
      }),
    );
    if (response.code != 200 && response.code?.toUpperCase?.() !== 'OK') {
      console.log(`\x1b[31m🐣️ saga getGroupSearch error: ${response}\x1b[0m`);
    }
  } catch (err) {
    console.log(`\x1b[31m🐣️ saga getGroupSearch error: ${err}\x1b[0m`);
    yield put(groupsActions.setGroupSearch({loading: false, result: []}));
    // yield showError(err);
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
          // @ts-ignore
          newSkip = newSkip + response?.[role]?.data?.length || 0;
          if (newGroupMembers?.[role]) {
            const roleData = {...newGroupMembers[role]};
            newGroupMembers[role].data = roleData.data?.concat(
              // @ts-ignore
              response?.[role]?.data || [],
            );
          } else {
            // @ts-ignore
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

function* uploadImage({payload}: {type: string; payload: IGroupImageUpload}) {
  try {
    const {file, id, fieldName, uploadType} = payload;
    yield updateLoadingImageState(fieldName, true);

    const data: IGetFile = yield FileUploader.getInstance().upload({
      file,
      uploadType,
    });

    yield put(
      groupsActions.editGroupDetail({
        data: {id, [fieldName]: data.url},
        editFieldName:
          fieldName === 'icon'
            ? i18next.t('common:text_avatar')
            : i18next.t('common:text_cover'),
      }),
    );
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
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    navigation.navigate(groupStack.groupMembers, {groupId});
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

function* cancelJoinGroup({
  payload,
}: {
  type: string;
  payload: {groupId: number; groupName: string};
}) {
  try {
    const {groupId, groupName} = payload;

    yield groupsDataHelper.cancelJoinGroup(groupId);

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({
        id: groupId,
        data: {join_status: 1},
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
      err?.meta?.message ===
      'You have been approved to be a member of this group'
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

    yield showError(err);
  }
}

function* getMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; params?: any};
}) {
  try {
    const {groups} = yield select();

    const {groupId, params} = payload;
    const {data, canLoadMore} = groups.pendingMemberRequests || {};

    if (!canLoadMore) return;

    // @ts-ignore
    const response = yield groupsDataHelper.getMemberRequests(groupId, {
      offset: data.length,
      limit: appConfig.recordsPerPage,
      key: memberRequestStatus.waiting,
      ...params,
    });

    const requestIds = response?.data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response?.data);

    yield put(groupsActions.setMemberRequests({requestIds, requestItems}));
  } catch (err) {
    console.log('getMemberRequests: ', err);
    yield showError(err);
  }
}

function* approveSingleMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    groupId: number;
    requestId: number;
    fullName: string;
    callback: () => void;
  };
}) {
  const {groupId, requestId, fullName, callback} = payload;
  try {
    yield groupsDataHelper.approveSingleMemberRequest(groupId, requestId);

    yield put(groupsActions.getGroupDetail(groupId));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
        rightIcon: 'UsersAlt',
        rightText: 'Members',
        onPressRight: callback,
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err: any) {
    console.log('approveSingleMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANNOT_APPROVE) {
      yield approvalError(groupId, err.code, fullName);
      return;
    }

    yield showError(err);
  }
}

function* approveAllMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; total: number; callback?: () => void};
}) {
  const {groupId, total, callback} = payload;
  try {
    yield groupsDataHelper.approveAllMemberRequests(groupId, total);

    yield put(groupsActions.getGroupDetail(groupId));

    if (callback) {
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_approved_all', {count: total})}`,
        props: {
          textProps: {useI18n: true},
          type: 'success',
          rightIcon: 'UsersAlt',
          rightText: 'Members',
          onPressRight: callback,
        },
        toastType: 'normal',
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    }
  } catch (err: any) {
    console.log('approveAllMemberRequests: ', err);

    if (err?.code === approveDeclineCode.CANNOT_APPROVE_ALL) {
      yield approvalError(groupId, err.code);
      return;
    }

    yield showError(err);
  }
}

function* declineSingleMemberRequest({
  payload,
}: {
  type: string;
  payload: {groupId: number; requestId: number; fullName: string};
}) {
  const {groupId, requestId, fullName} = payload;
  try {
    yield groupsDataHelper.declineSingleMemberRequest(groupId, requestId);
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err: any) {
    console.log('declineSingleMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANNOT_DECLINE) {
      yield approvalError(groupId, err.code, fullName);
      return;
    }

    yield showError(err);
  }
}

function* declineAllMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; total: number; callback?: () => void};
}) {
  const {groupId, total, callback} = payload;
  try {
    yield groupsDataHelper.declineAllMemberRequests(groupId, total);
    yield put(groupsActions.getGroupDetail(groupId));

    if (callback) callback();
  } catch (err: any) {
    console.log('declineAllMemberRequests: ', err);

    if (err?.code === approveDeclineCode.CANNOT_DECLINE_ALL) {
      yield approvalError(groupId, err.code);
      return;
    }

    yield showError(err);
  }
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

export function* refreshGroupMembers(groupId: number) {
  yield put(groupsActions.clearGroupMembers());
  yield put(groupsActions.getGroupMembers({groupId}));
  yield put(groupsActions.getGroupDetail(groupId));
}

function* approvalError(groupId: number, code: string, fullName?: string) {
  let errorMsg: string;
  if (code === approveDeclineCode.CANNOT_APPROVE) {
    errorMsg = i18next
      .t('groups:text_cannot_approve_single')
      // @ts-ignore
      .replace('{0}', fullName);
  } else if (code === approveDeclineCode.CANNOT_APPROVE_ALL) {
    errorMsg = i18next.t('groups:text_cannot_approve_all');
  } else if (code === approveDeclineCode.CANNOT_DECLINE) {
    errorMsg = i18next
      .t('groups:text_cannot_decline_single')
      // @ts-ignore
      .replace('{0}', fullName);
  } else {
    errorMsg = i18next.t('groups:text_cannot_decline_all');
  }

  yield put(
    modalActions.showHideToastMessage({
      content: errorMsg,
      props: {
        textProps: {useI18n: true},
        type: 'informative',
      },
      toastType: 'normal',
    }),
  );

  // reload page
  yield put(groupsActions.resetMemberRequests());
  yield put(groupsActions.getMemberRequests({groupId}));
  yield put(groupsActions.getGroupDetail(groupId));
}
