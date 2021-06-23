import {all, put, call, takeLatest, select} from 'redux-saga/effects';

import * as types from './constants';
import * as actions from './actions';
import * as api from './api';
import {timeout} from '~/utils/common';
import {messages} from './dummy';
import {IObject} from '~/interfaces/common';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.SELECT_CONVERSATION, selectConversation);
}

function* selectConversation() {
  try {
    const state: IObject<any> = yield select();
    const {chat} = state;

    //[FIXME] Should be removed when API ready for use
    yield timeout(1000);
    yield put(actions.setMessages(messages(chat.conversation)));
  } catch (err) {
    console.log('getConfigs', {err});
  } finally {
  }
}
