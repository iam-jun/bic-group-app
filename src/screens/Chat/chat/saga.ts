import {all, put, call, takeLatest, select} from 'redux-saga/effects';

import * as types from './constants';
import * as actions from './actions';
import * as api from './api';
import {timeOut} from '~/utils/common';
import {messages} from './dummy';
import {IObject} from '~/interfaces/common';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.SELECT_CONVERSATION, selectConversation);
  yield takeLatest(types.GET_MESSAGES, getMessages);
}

function* selectConversation() {
  yield put(actions.getMessages());
}

function* getMessages() {
  try {
    const state: IObject<any> = yield select();
    const {chat} = state;

    //[FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    yield put(actions.setMessages(messages(chat.conversation)));
  } catch (err) {
    console.log('getMessages', {err});
  } finally {
  }
}
