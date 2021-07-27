import {put, takeLatest} from 'redux-saga/effects';

import * as types from './constants';
import actions from './actions';
import appConfig from '~/configs/appConfig';
import {ISocketEvent} from '~/interfaces/ISocket';

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
  if (payload.msg !== 'result' || payload.id !== appConfig.chatSocketUniqueId)
    return;

  yield put(actions.setConversations(payload.result));
}
