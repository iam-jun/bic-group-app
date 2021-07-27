import {mapConversation, mapMessage} from './../helper';
import {CHAT_SOCKET_GET_MESSAGES_ID} from './../../../services/constants';
import {put, select, takeLatest} from 'redux-saga/effects';

import * as types from './constants';
import actions from './actions';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IObject} from '~/interfaces/common';
import {CHAT_SOCKET_GET_CONVERSIONS_ID} from '~/services/constants';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
}

function* handleEvent({payload}: {type: string; payload: ISocketEvent}) {
  // console.log('handleEvent', payload);

  if (payload.msg !== 'result') return;

  switch (payload.id) {
    case CHAT_SOCKET_GET_CONVERSIONS_ID:
      yield handleConversations(payload.result);
      break;
    case CHAT_SOCKET_GET_MESSAGES_ID:
      yield handleMessages(payload.result?.messages);
      break;
  }
}

function* handleConversations(data: []) {
  const state: IObject<any> = yield select();
  const {auth} = state;

  yield put(actions.setConversations(mapConversation(auth.user, data)));
}

function* handleMessages(data?: []) {
  const state: IObject<any> = yield select();

  const {chat} = state;
  const {messages} = chat;

  if (messages.data.length === 0)
    yield put(actions.setMessages(mapMessage(data)));
  else yield put(actions.setExtraMessages(mapMessage(data)));
}
