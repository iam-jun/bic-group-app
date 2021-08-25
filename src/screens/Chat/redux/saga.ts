import {StackActions} from '@react-navigation/native';
import {AxiosResponse} from 'axios';
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';

import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {chatSocketId, messageEventTypes} from '~/constants/chat';
import {IObject} from '~/interfaces/common';
import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage, ISendMessageAction} from '~/interfaces/IChat';
import {ICreateRoomReq} from '~/interfaces/IChatHttpRequest';
import {ISocketEvent} from '~/interfaces/ISocket';
import {withNavigation} from '~/router/helper';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {rootNavigationRef} from '~/router/navigator/refs';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {
  mapConversation,
  mapData,
  mapMessage,
  mapRole,
  mapUsers,
} from './../helper';
import actions from './actions';
import * as types from './constants';

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
  yield takeLatest(types.UPLOAD_FILE, uploadFile);
  yield takeLatest(types.RETRY_SEND_MESSAGE, retrySendMessage);
  yield takeLatest(types.GET_SUBSCRIPTIONS, getSubscriptions);
  yield takeLatest(types.READ_SUBCRIPTIONS, readSubcriptions);
  yield takeLatest(types.UPDATE_CONVERSATION_NAME, updateConversationName);
  yield takeLatest(types.REMOVE_MEMBER, removeMember);
  yield takeLatest(types.GET_MENTION_USERS, getMentionUsers);
}

function* initChat() {
  yield put(actions.getSubscriptions());
  yield put(actions.resetData('groups'));
  yield put(actions.getData('groups'));
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
    console.log('getData', dataType, err);
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
      apiConfig.Chat.groupInfo({
        roomId: payload,
      }),
    );

    yield put(
      actions.setConversationDetail(
        mapConversation(auth.user, response.data?.group),
      ),
    );
  } catch (err) {
    console.log('getConversationDetail', err);
  }
}

function* createConversation({
  payload,
}: {
  payload: ICreateRoomReq;
  type: string;
}) {
  try {
    const state: IObject<any> = yield select();
    const {auth} = state;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.createRoom(payload),
    );

    const conversation = mapConversation(auth.user, response.data.group);

    yield put(actions.selectConversation(conversation));
    yield put(actions.createConversationSuccess(conversation));

    rootNavigationRef?.current?.dispatch(
      StackActions.replace(chatStack.conversation),
    );
  } catch (err) {
    console.log('createConversation', err);
  }
}

function* uploadFile({payload}: {payload: IMessage; type: string}) {
  try {
    if (!payload.attachment) return;
    const {chat} = yield select();
    const {conversation} = chat;

    const formData = new FormData();
    formData.append('file', {
      type: payload.attachment.type,
      //@ts-ignore
      name: payload.attachment.name || 'fileMessage',
      uri: payload.attachment.uri,
    });
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

    const message = mapMessage(response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    console.log('uploadFile', err);
    yield put(actions.sendMessageFailed(payload));
  }
}

function* sendMessage({payload}: {payload: ISendMessageAction; type: string}) {
  try {
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.sendMessage({
        message: {
          _id: payload._id,
          rid: payload.room_id,
          msg: payload.text,
        },
      }),
    );

    const message = mapMessage(response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    yield put(actions.sendMessageFailed(payload));
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

function* removeMember({payload}: {type: string; payload: IUser}) {
  try {
    const {chat} = yield select();
    const data = {
      roomId: chat.conversation._id,
      userId: payload._id.toString(),
    };
    yield makeHttpRequest(apiConfig.Chat.removeMember(data));
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
    const message = mapMessage(data);
    const existed = chat.groups.data.find(
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
    const message = mapMessage(data);
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
    case messageEventTypes.REMOVE_USER:
      yield handleRemoveUser(data);
      break;
  }
}
