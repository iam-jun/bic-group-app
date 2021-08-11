import {StackActions} from '@react-navigation/native';
import {AxiosResponse} from 'axios';
import {put, select, takeLatest} from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {chatSocketId, messageEventTypes} from '~/constants/chat';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/interfaces/IChat';
import {ICreateRoomReq} from '~/interfaces/IChatHttpRequest';
import {ISocketEvent} from '~/interfaces/ISocket';
import {withNavigation} from '~/router/helper';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {rootNavigationRef} from '~/router/navigator/refs';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {mapConversation, mapData, mapMessage, mapRole} from './../helper';
import actions from './actions';
import * as types from './constants';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

const navigation = withNavigation(rootNavigationRef);

export default function* saga() {
  yield takeLatest(types.GET_DATA, getData);
  yield takeLatest(types.MERGE_EXTRA_DATA, mergeExtraData);
  yield takeLatest(types.GET_GROUP_ROLES, getGroupRoles);
  yield takeLatest(types.GET_CONVERSATION_DETAIL, getConversationDetail);
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.CREATE_CONVERSATION, createConversation);
  yield takeLatest(types.SEND_MESSAGE, sendMessage);
  yield takeLatest(types.RETRY_SEND_MESSAGE, retrySendMessage);
  yield takeLatest(types.GET_SUBSCRIPTIONS, getSubscriptions);
  yield takeLatest(types.READ_SUBCRIPTIONS, readSubcriptions);
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

function* sendMessage({payload}: {payload: IMessage; type: string}) {
  try {
    const {chat} = yield select();
    const {conversation} = chat;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.sendMessage({
        roomId: conversation._id,
        text: payload.text,
      }),
    );

    const message = mapMessage(response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    console.log('createConversation', err);
    yield put(actions.sendMessageFailed(payload));
  }
}

function* retrySendMessage({payload, type}: {payload: IMessage; type: string}) {
  yield sendMessage({payload, type});
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

function* handleRoomsMessage(payload?: any) {
  const data = payload.fields.args[0];
  const {auth} = yield select();

  switch (data.t) {
    case messageEventTypes.ADD_USER:
    case messageEventTypes.ROOM_CHANGED_ANNOUNCEMENT:
    case messageEventTypes.ROOM_CHANGED_DESCRIPTION:
    case messageEventTypes.ROOM_CHANGED_NAME:
    case messageEventTypes.ROOM_CHANGED_TOPIC:
      console.log('In development');
      break;
    // New message event doesn't have type
    case undefined:
      yield put(actions.addNewMessage(mapMessage(data)));
      break;
  }
}
