import {generateRoomName} from './../../../utils/generator';
import {put, select, takeLatest} from 'redux-saga/effects';

import * as types from './constants';
import actions from './actions';
import appConfig from '~/configs/appConfig';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IObject} from '~/interfaces/common';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.HANDLE_CONVERSATIONS_EVENT, handleConversationsEvent);
  yield takeLatest(types.SELECT_CONVERSATION, selectConversation);
}

function* selectConversation() {
  // yield put(actions.getMessages());
}

function* handleConversationsEvent({
  payload,
}: {
  type: string;
  payload: ISocketEvent;
}) {
  console.log(payload);
  if (payload.msg !== 'result' || payload.id !== appConfig.chatSocketUniqueId)
    return;

  const state: IObject<any> = yield select();
  const {auth} = state;

  const result = (payload.result || []).map((item: any) => ({
    ...item,
    id: item._id,
    name: item.name || generateRoomName(auth.user, item.usernames),
    type: item.t,
    user: item.u,
    updateAt: item._updateAt,
    lastMessage: item.lastMessage?.msg,
  }));

  console.log({result});

  yield put(actions.setConversations(result));
}
