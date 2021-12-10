import i18next from 'i18next';
import {Platform} from 'react-native';
import {put, select, takeLatest} from 'redux-saga/effects';

import {
  IGetMemberRequests,
  IGroupAddMembers,
  IGroupDetailEdit,
  IGroupGetJoinableMembers,
  IGroupGetMembers,
  IGroupImageUpload,
  IGroupRemoveAdmin,
  IGroupSetAdmin,
  IJoiningMember,
  IPayloadGetGroupPost,
} from '~/interfaces/IGroup';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsTypes from '~/screens/Groups/redux/types';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IResponseData, IToastMessage} from '~/interfaces/common';
import {mapData, mapRequestMembers} from '../helper/mapper';
import appConfig from '~/configs/appConfig';
import FileUploader from '~/services/fileUploader';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import {isArray} from 'lodash';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import errorCode from '~/constants/errorCode';
import memberRequestStatus from '~/constants/memberRequestStatus';

const navigation = withNavigation(rootNavigationRef);

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
    // @ts-ignore
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

function* getGroupSearch({payload}: {type: string; payload: string}) {
  try {
    yield put(groupsActions.setGroupSearch({loading: true}));
    const params = {key: payload || '', discover: true};
    // @ts-ignore
    const response = yield groupsDataHelper.getSearchGroups(params);
    if (isArray(response?.data)) {
      yield put(
        groupsActions.setGroupSearch({
          result: response.data || [],
          loading: false,
        }),
      );
    } else {
      yield put(groupsActions.setGroupSearch({loading: false}));
      yield showError(response);
    }
  } catch (err) {
    console.log(`\x1b[31m🐣️ saga getGroupSearch error: ${err}\x1b[0m`);
    yield put(groupsActions.setGroupSearch({loading: false, result: []}));
    // yield showError(err);
  }
}

function* editGroupDetail({
  payload,
  editFieldName,
  callback,
}: {
  type: string;
  payload: IGroupDetailEdit;
  editFieldName?: string;
  callback?: () => void;
}) {
  try {
    // @ts-ignore
    const result = yield requestEditGroupDetail(payload);

    // this field is used to indicate which parts of
    // the profile have been updated
    let toastContent: string;
    if (editFieldName) {
      toastContent = `${editFieldName} ${i18next.t(
        'common:text_updated_successfully',
      )}`;
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
    if (callback) callback();

    yield put(groupsActions.getJoinedGroups());
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
      yield put(postActions.addToAllPosts({data: result}));
      yield put(groupsActions.setGroupPosts(result));
      if (result.length === appConfig.recordsPerPage) {
        yield put(groupsActions.getGroupPosts(payload));
      }
    } else {
      yield put(postActions.addToAllPosts({data: result}));
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

    yield put(
      groupsActions.editGroupDetail(
        {id, [fieldName]: data},
        fieldName === 'icon'
          ? i18next.t('common:text_avatar')
          : i18next.t('common:text_cover'),
      ),
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

function* removeMember({
  payload,
}: {
  type: string;
  payload: {groupId: number; userId: string; userFullname: string};
}) {
  try {
    const {groupId, userId, userFullname} = payload;

    yield groupsDataHelper.removeUsers(groupId, [userId]);

    yield refreshGroupMembers(groupId);

    const toastMessage: IToastMessage = {
      content: i18next
        .t('common:message_remove_member_success')
        .replace('{n}', userFullname),
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

function* joinNewGroup({
  payload,
}: {
  type: string;
  payload: {groupId: number; groupName: string};
}) {
  try {
    const {groupId, groupName} = payload;

    // @ts-ignore
    const response = yield groupsDataHelper.joinGroup(groupId);
    const join_status = response?.data?.join_status;
    const hasRequested = join_status === groupJoinStatus.requested;

    if (hasRequested) {
      yield put(groupsActions.getGroupDetail(groupId));
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_group')} ${groupName}`,
        props: {
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
      return;
    }

    yield put(groupsActions.getJoinedGroups());

    const toastMessage: IToastMessage = {
      content: `${i18next.t(
        'groups:text_successfully_join_group',
      )} ${groupName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.setLoadingPage(true));
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err) {
    console.error('joinNewGroup catch', err);
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
      yield put(groupsActions.setLoadingPage(true));
      yield put(groupsActions.getGroupDetail(payload.groupId));
      yield put(groupsActions.getJoinedGroups());

      return;
    }

    yield showError(err);
  }
}

function* leaveGroup({payload}: {payload: number; type: string}) {
  try {
    const {groups} = yield select();
    const privacy = groups?.groupDetail?.group?.privacy;

    yield groupsDataHelper.leaveGroup(payload);
    yield put(groupsActions.getJoinedGroups());

    if (privacy === groupPrivacy.secret) {
      if (Platform.OS !== 'web') navigation.replace(groupStack.groups);
      else {
        const topParentGroupId = groups?.joinedGroups[0]?.id;
        navigation.navigate(groupStack.groupDetail, {
          groupId: topParentGroupId,
          initial: true,
        });
      }
    } else {
      navigation.navigate(groupStack.groupDetail, {
        groupId: payload,
        initial: true,
      });
    }

    yield put(
      groupsActions.setGroupDetail({...groups?.groupDetail, join_status: 1}),
    );
    yield put(groupsActions.getGroupDetail(payload));

    const toastMessage: IToastMessage = {
      content: i18next.t('groups:modal_confirm_leave_group:success_message'),
      props: {
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log('leaveGroup:', err);
    yield showError(err);
  }
}

function* setGroupAdmin({payload}: {type: string; payload: IGroupSetAdmin}) {
  try {
    const {groupId, userIds} = payload;

    yield groupsDataHelper.setGroupAdmin(groupId, userIds);

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_set_admin:success_message',
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    // refresh group detail after adding new admins
    yield refreshGroupMembers(groupId);
  } catch (err) {
    console.log('setGroupAdmin: ', err);
    yield showError(err);
  }
}

function* removeGroupAdmin({
  payload,
}: {
  type: string;
  payload: IGroupRemoveAdmin;
}) {
  try {
    const {groupId, userId} = payload;

    yield groupsDataHelper.removeGroupAdmin(groupId, userId);

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_remove_admin:success_message',
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    // refresh group detail after adding new admins
    yield refreshGroupMembers(groupId);
  } catch (err) {
    console.log('setGroupAdmin: ', err);
    yield showError(err);
  }
}

function* getMemberRequests({
  payload,
}: {
  type: string;
  payload: IGetMemberRequests;
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
    const requestItems = mapRequestMembers(response?.data);

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
  try {
    const {groupId, requestId, fullName, callback} = payload;
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
  } catch (err) {
    console.log('approveSingleMemberRequest: ', err);
    yield showError(err);
  }
}

function* approveAllMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; callback: () => void};
}) {
  try {
    const {groupId, callback} = payload;

    // @ts-ignore
    const response = yield groupsDataHelper.approveAllMemberRequests(groupId);
    const total = response?.data?.total;

    yield put(groupsActions.getGroupDetail(groupId));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_all')}`.replace(
        '{0}',
        `${total}`,
      ),
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
  } catch (err) {
    console.log('approveAllMemberRequests: ', err);
    yield showError(err);
  }
}

function* declineSingleMemberRequest({
  payload,
}: {
  type: string;
  payload: {groupId: number; requestId: number; fullName: string};
}) {
  try {
    const {groupId, requestId, fullName} = payload;
    yield groupsDataHelper.declineSingleMemberRequest(groupId, requestId);

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log('declineSingleMemberRequest: ', err);
    yield showError(err);
  }
}

function* declineAllMemberRequests({payload}: {type: string; payload: number}) {
  try {
    yield groupsDataHelper.declineAllMemberRequests(payload);
  } catch (err) {
    console.log('declineAllMemberRequests: ', err);
    yield showError(err);
  }
}

function* showError(err: any) {
  if (err.code === errorCode.systemIssue) return;

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

function* refreshGroupMembers(groupId: number) {
  yield put(groupsActions.clearGroupMembers());
  yield put(groupsActions.getGroupMembers({groupId}));
  yield put(groupsActions.getGroupDetail(groupId));
  yield put(groupsActions.getJoinedGroups());
}
