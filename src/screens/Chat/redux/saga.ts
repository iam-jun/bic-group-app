import {put, select, takeLatest} from 'redux-saga/effects';
import {AxiosResponse} from 'axios';

import {
  mapConversation,
  mapConversations,
  mapMessages,
  mapUser,
} from './../helper';
import {CHAT_SOCKET_GET_MESSAGES_ID} from '~/services/constants';

import * as types from './constants';
import actions from './actions';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IObject} from '~/interfaces/common';
import {
  CHAT_SOCKET_GET_CONVERSIONS_ID,
  CHAT_SOCKET_CREATE_DIRECT_CHAT_ID,
} from '~/services/constants';
import {
  handleResponseSuccessBein,
  makeHttpRequest,
} from '~/services/httpApiRequest';
import apiConfig from '~/configs/apiConfig';
import {rootNavigationRef} from '~/router/navigator/refs';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {StackActions} from '@react-navigation/native';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.GET_USERS, getUsers);
}

function* handleEvent({payload}: {type: string; payload: ISocketEvent}) {
  console.log('handleEvent', payload);

  if (payload.msg !== 'result') return;

  switch (payload.id) {
    case CHAT_SOCKET_GET_CONVERSIONS_ID:
      yield handleConversations(payload.result);
      break;
    case CHAT_SOCKET_GET_MESSAGES_ID:
      yield handleMessages(payload.result?.messages);
      break;
    case CHAT_SOCKET_CREATE_DIRECT_CHAT_ID:
      yield handleCreateDirectMessage(payload.result);
      break;
  }
}

function* handleConversations(data: []) {
  const state: IObject<any> = yield select();
  const {auth} = state;

  yield put(actions.setConversations(mapConversations(auth.user, data)));
}

function* handleMessages(data?: []) {
  const state: IObject<any> = yield select();

  const {chat} = state;
  const {messages} = chat;

  if (messages.data.length === 0)
    yield put(actions.setMessages(mapMessages(data)));
  else yield put(actions.setExtraMessages(mapMessages(data)));
}

function* handleCreateDirectMessage(data: any) {
  const state: IObject<any> = yield select();
  const {auth} = state;
  const conversation = mapConversation(auth.user, data);
  yield put(actions.selectConversation(conversation));
  yield put(actions.createConversationSuccess(conversation));
  rootNavigationRef?.current?.dispatch(
    StackActions.replace(chatStack.conversation),
  );
}

function* getUsers() {
  try {
    const httpResponse: AxiosResponse = yield makeHttpRequest(
      apiConfig.App.users(),
    );
    if (httpResponse) {
      const {data} = handleResponseSuccessBein(httpResponse);
      yield put(actions.setUsers(data.map((item: any) => mapUser(item))));
    }
  } catch (e) {
    console.log('getUsers error', e);
  }
}
