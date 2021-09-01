import {StackActions} from '@react-navigation/native';
import {AxiosResponse} from 'axios';
import i18next from 'i18next';
import {Platform} from 'react-native';
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {chatSocketId, messageEventTypes, roomTypes} from '~/constants/chat';
import {
  IChatUser,
  IConversation,
  IMessage,
  ISendMessageAction,
} from '~/interfaces/IChat';
import {IAddUsersToGroupReq} from '~/interfaces/IChatHttpRequest';
import {ISocketEvent} from '~/interfaces/ISocket';
import {withNavigation} from '~/router/helper';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {rootNavigationRef} from '~/router/navigator/refs';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {generateRoomName} from '~/utils/generator';
import {
  mapConversation,
  mapData,
  mapMessage,
  mapRole,
  mapUsers,
} from './../helper';
import actions from './actions';
import * as types from './constants';
import * as modalActions from '~/store/modal/actions';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

const navigation = withNavigation(rootNavigationRef);

export default function* saga() {
  yield takeLatest(types.INIT_CHAT, initChat);
  yield takeLatest(types.GET_DATA, getData);
  yield takeLatest(types.MERGE_EXTRA_DATA, mergeExtraData);
  yield takeLatest(types.GET_GROUP_ROLES, getGroupRoles);
  yield takeLatest(types.GET_CONVERSATION_DETAIL, getConversationDetail);
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.CREATE_CONVERSATION, createConversation);
  yield takeEvery(types.SEND_MESSAGE, sendMessage);
  yield takeLatest(types.DELETE_MESSAGE, deleteMessage);
  yield takeLatest(types.UPLOAD_FILE, uploadFile);
  yield takeLatest(types.RETRY_SEND_MESSAGE, retrySendMessage);
  yield takeLatest(types.GET_SUBSCRIPTIONS, getSubscriptions);
  yield takeLatest(types.READ_SUBCRIPTIONS, readSubcriptions);
  yield takeLatest(types.UPDATE_CONVERSATION_NAME, updateConversationName);
  yield takeLatest(types.ADD_USERS_TO_GROUP, addUsersToGroup);
  yield takeLatest(types.REMOVE_MEMBER, removeMember);
  yield takeLatest(types.GET_MENTION_USERS, getMentionUsers);
}

function* initChat() {
  yield put(actions.getSubscriptions());
  yield put(actions.resetData('rooms'));
  yield put(actions.getData('rooms', null, 'data'));
}

function* getData({
  dataType,
  payload,
  field,
}: {
  type: string;
  payload: any;
  field: string;
  dataType: string;
}) {
  try {
    const {auth, chat} = yield select();
    const {offset, data} = chat[dataType];

    const response: AxiosResponse = yield makeHttpRequest(
      //@ts-ignore
      apiConfig.Chat[dataType]({
        offset,
        count: appConfig.recordsPerPage,
        ...payload,
      }),
    );

    const result = mapData(
      auth.user,
      dataType,
      response.data[field || dataType],
    );

    if (data.length === 0) {
      yield put(actions.setData(dataType, result));
      if (result.length === appConfig.recordsPerPage)
        yield put(actions.getData(dataType, payload));
    } else {
      yield put(actions.setExtraData(dataType, result));
    }
  } catch (err) {
    console.error('getData', dataType, err);
  }
}

function* mergeExtraData({dataType}: {type: string; dataType: string}) {
  const {chat} = yield select();
  const {canLoadMore, loading, params} = chat[dataType];
  if (!loading && canLoadMore) {
    yield put(actions.getData(dataType, params));
  }
}

function* getGroupRoles() {
  try {
    const {chat} = yield select();
    const {conversation} = chat;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.roles({
        roomId: conversation._id,
      }),
    );

    const roles = (response.data.roles || []).map((role: any) => mapRole(role));

    yield put(actions.setGroupRoles(roles));
  } catch (err) {
    console.log('getGroupRoles', err);
  }
}

function* getSubscriptions() {
  try {
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.subcriptions(),
    );

    yield put(actions.setSubscriptions(response.data?.update || []));
  } catch (err) {
    console.log('getSubscriptions', err);
  }
}

function* readSubcriptions({payload}: {type: string; payload: string}) {
  try {
    yield makeHttpRequest(
      apiConfig.Chat.readSubcriptions({
        rid: payload,
      }),
    );
  } catch (err) {
    console.log('readSubcriptions', err);
  }
}

function* getConversationDetail({payload}: {type: string; payload: string}) {
  try {
    const {auth} = yield select();

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getChatInfo(payload),
    );

    yield put(
      actions.setConversationDetail(
        mapConversation(auth.user, response.data?.data),
      ),
    );
  } catch (err) {
    console.log('getConversationDetail', err);
  }
}

function* createConversation({payload}: {payload: IChatUser[]; type: string}) {
  try {
    const {auth, chat} = yield select();
    const {user} = auth;
    const {rooms} = chat;

    let response: AxiosResponse | null = null;
    if (payload.length === 1) {
      const existedRoom = rooms.data.find(
        (room: IConversation) =>
          room.type === roomTypes.DIRECT &&
          (room.usernames || []).includes(payload[0].username),
      );
      if (existedRoom) {
        yield put(
          modalActions.showAlert({
            title: i18next.t('common:text_error'),
            content: i18next.t('chat:error:existing_direct_chat'),
            confirmLabel: i18next.t('common:text_ok'),
            onConfirm: () => {
              navigation.replace(chatStack.conversation, {
                roomId: existedRoom._id,
              });
            },
          }),
        );
        return;
      }
      response = yield makeHttpRequest(
        apiConfig.Chat.createDirectChat({username: payload[0].username}),
      );
    } else {
      const name = generateRoomName(
        user,
        payload.map((_user: IChatUser) => _user?.name),
      );

      const members = [...payload, user];

      const data = {
        name,
        members: payload.map((user: IChatUser) => user.username),
        customFields: {
          type: roomTypes.QUICK,
          usernames: members.map((user: IChatUser) => user.username),
          members: payload.length === 1 ? members : null,
        },
      };
      response = yield makeHttpRequest(apiConfig.Chat.createRoom(data));
    }

    const conversation = mapConversation(
      auth.user,
      payload.length === 1
        ? {
            ...response?.data?.room,
            name: payload[0].name,
          }
        : response?.data?.group,
    );

    yield put(actions.setConversationDetail(conversation));
    yield put(actions.createConversationSuccess(conversation));

    rootNavigationRef?.current?.dispatch(
      StackActions.replace(chatStack.conversation),
    );
  } catch (err) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* uploadFile({payload}: {payload: IMessage; type: string}) {
  try {
    if (!payload.attachment) return;
    const {auth, chat} = yield select();
    const {conversation} = chat;

    const formData = new FormData();
    if (Platform.OS === 'web') {
      formData.append(
        'file',
        // @ts-ignore
        payload.attachment,
        payload.attachment.name || 'fileMessage',
      );
    } else {
      formData.append('file', {
        type: payload.attachment.type,
        //@ts-ignore
        name: payload.attachment.name || 'fileMessage',
        uri: payload.attachment.uri,
      });
    }

    formData.append(
      'description',
      JSON.stringify({
        localId: payload.localId,
        size: payload.attachment.size,
        type: payload.attachment.type,
      }),
    );

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.uploadFile(conversation._id, formData),
    );
    console.log('uploadFile', response);

    const message = mapMessage(auth.user, response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    console.log('uploadFile', err);
    yield put(actions.sendMessageFailed(payload));
  }
}

function* sendMessage({payload}: {payload: ISendMessageAction; type: string}) {
  try {
    const {auth} = yield select();

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.sendMessage({
        message: {
          _id: payload._id,
          rid: payload.room_id,
          msg: payload.text,
        },
      }),
    );

    const message = mapMessage(auth.user, response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    yield put(actions.sendMessageFailed(payload));
  }
}

function* deleteMessage({payload}: {payload: IMessage; type: string}) {
  try {
    yield makeHttpRequest(
      apiConfig.Chat.deleteMessage({
        roomId: payload.room_id,
        msgId: payload._id,
      }),
    );
  } catch (err) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* updateConversationName({payload}: {type: string; payload: string}) {
  try {
    const {chat} = yield select();
    const {conversation} = chat;

    yield makeHttpRequest(
      apiConfig.Chat.updateGroupName({
        roomId: conversation._id,
        name: payload,
      }),
    );
  } catch (err) {
    console.log('updateConversationName', err);
  }
}

function* addUsersToGroup({
  payload,
}: {
  type: string;
  payload: IAddUsersToGroupReq;
}) {
  try {
    const {groupId, userIds} = payload;

    yield groupsDataHelper.addUsers(groupId, userIds);
    handleAddMember();
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

function* removeMember({payload}: {type: string; payload: IChatUser}) {
  try {
    const {chat} = yield select();
    const {conversation} = chat;
    if (conversation.type === roomTypes.GROUP) {
      yield groupsDataHelper.removeUsers(conversation.beinGroupId, [
        payload.beinUserId,
      ]);
    } else {
      const data = {
        roomId: conversation._id,
        userId: payload._id.toString(),
      };
      yield makeHttpRequest(apiConfig.Chat.removeMember(data));
    }
  } catch (err) {
    console.log('removeMember', err);
  }
}

function* retrySendMessage({payload, type}: {payload: IMessage; type: string}) {
  if (payload.attachment) yield uploadFile({payload, type});
  else yield sendMessage({payload, type});
}

function* getMentionUsers({payload}: {payload: string; type: string}) {
  try {
    const {chat} = yield select();
    const {conversation} = chat;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.mentionUsers({
        query: {
          $and: [
            {__rooms: {$eq: conversation._id}},
            {name: {$regex: payload, $options: 'ig'}},
          ],
        },
      }),
    );

    const users = mapUsers(response.data.users);
    yield put(actions.setMentionUsers(users));
  } catch (err) {
    console.log('getMentionUsers', err);
  }
}

function* handleEvent({payload}: {type: string; payload: ISocketEvent}) {
  /* Because subscription "stream-room-messages" event
      always return id: "id" so we can't handle it by id.
      [TO-DO] Need to check with BE
  */

  if (
    payload.msg === 'changed' &&
    payload.collection === 'stream-room-messages'
  ) {
    yield handleRoomsMessage(payload);
  }

  if (payload.msg !== 'result') return;
  switch (payload.id) {
    case chatSocketId.ADD_MEMBERS_TO_GROUP:
      handleAddMember();
      break;
  }
}

function handleAddMember() {
  navigation.replace(chatStack.conversation);
}

function* handleNewMessage(data: any) {
  try {
    const {chat, auth} = yield select();
    const message = mapMessage(auth.user, data);
    const existed = chat.rooms.data.find(
      (item: IConversation) => item._id === message?.room_id,
    );

    if (existed) yield put(actions.addNewMessage(message));
    else {
      const response: AxiosResponse = yield makeHttpRequest(
        apiConfig.Chat.groupInfo({
          roomId: message?.room_id,
        }),
      );
      yield put(
        actions.createConversationSuccess(
          mapConversation(auth.user, response.data?.group),
        ),
      );
      yield getSubscriptions();
    }
  } catch (err) {
    console.log('handleNewMessage', err);
  }
}

function* handleRemoveUser(data: any) {
  try {
    const {auth} = yield select();
    const message = mapMessage(auth.user, data);
    console.log('handleRemoveUser', message, auth.user);

    if (message.msg === auth.user.username) {
      yield put(actions.kickMeOut(message));
      navigation.replace(chatStack.conversationList);
    } else {
      yield handleNewMessage(data);
      yield put(actions.removeMemberSuccess(message));
    }
  } catch (err) {
    console.log('handleRemoveUser', err);
  }
}

function* handleRemoveMessage(data: any) {
  try {
    const {auth} = yield select();
    const message = mapMessage(auth.user, data);
    yield put(actions.deleteMessageSuccess(message));
  } catch (err) {
    console.log('handleRemoveMessage', err);
  }
}

function* handleRoomsMessage(payload?: any) {
  const data = payload.fields.args[0];

  switch (data.t) {
    case messageEventTypes.ADD_USER:
    case messageEventTypes.ROOM_CHANGED_ANNOUNCEMENT:
    case messageEventTypes.ROOM_CHANGED_DESCRIPTION:
    case messageEventTypes.ROOM_CHANGED_NAME:
    case messageEventTypes.ROOM_CHANGED_TOPIC:
    case undefined:
      yield handleNewMessage(data);
      break;
    case messageEventTypes.REMOVE_MESSAGE:
      yield handleRemoveMessage(data);
      break;
    case messageEventTypes.REMOVE_USER:
      yield handleRemoveUser(data);
      break;
  }
}
