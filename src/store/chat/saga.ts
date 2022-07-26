import { takeLatest } from 'redux-saga/effects';
import initChat from './saga/initChat';
import types from './constants';
import handleChatEvent from './saga/handleChatEvent';

export default function* chatSaga() {
  yield takeLatest(types.INIT_CHAT, initChat);
  yield takeLatest(types.HANDLE_CHAT_EVENT, handleChatEvent);
}
