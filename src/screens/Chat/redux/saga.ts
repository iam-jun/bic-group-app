import {put, select, takeLatest} from 'redux-saga/effects';
import {AxiosResponse} from 'axios';

import {
  mapConversation,
  mapConversations,
  mapMessages,
  mapUser,
} from './../helper';

import * as types from './constants';
import actions from './actions';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IObject} from '~/interfaces/common';
import {
  mapResponseSuccessBein,
  makeHttpRequest,
} from '~/services/httpApiRequest';
import apiConfig from '~/configs/apiConfig';
import {rootNavigationRef} from '~/router/navigator/refs';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {StackActions} from '@react-navigation/native';
import appConfig from '~/configs/appConfig';
import {ICreateRoomReq} from '~/interfaces/IHttpRequest';
import {chatSocketId} from '~/constants/chat';

/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

export default function* saga() {
  yield takeLatest(types.GET_CONVERSATIONS, getConversations);
  yield takeLatest(types.MERGE_EXTRA_CONVERSATIONS, mergeExtraConversations);
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.GET_USERS, getUsers);
  yield takeLatest(types.CREATE_CONVERSATION, createConversation);
}

function* getConversations() {
  try {
    const {auth, chat} = yield select();
    const {offset, data} = chat.conversations;
    console.log({offset});

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getRooms({
        offset,
        count: appConfig.recordsPerPage,
      }),
    );
    const conversations = mapConversations(auth.user, response.data?.groups);
    console.log({conversations});
    if (data.length === 0) {
      yield put(actions.setConversations(conversations));
      if (conversations.length === appConfig.recordsPerPage)
        yield put(actions.getConversations());
    } else {
      yield put(actions.setExtraConversations(conversations));
    }
  } catch (err) {
    console.log('getConversation', err);
  }
}

function* mergeExtraConversations() {
  const {chat} = yield select();
  const {canLoadMore, loading} = chat.conversations;
  if (!loading && canLoadMore) {
    yield put(actions.getConversations());
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
    console.log(response);
    const conversation = mapConversation(auth.user, response.data.channel);
    yield put(actions.selectConversation(conversation));
    yield put(actions.createConversationSuccess(conversation));
    rootNavigationRef?.current?.dispatch(
      StackActions.replace(chatStack.conversation),
    );
  } catch (err) {
    console.log('createConversation', err);
  }
}

function* handleEvent({payload}: {type: string; payload: ISocketEvent}) {
  console.log('handleEvent', payload);

  if (payload.msg !== 'result') return;

  switch (payload.id) {
    case chatSocketId.GET_MESSAGES:
      yield handleMessages(payload.result?.messages);
      break;
  }
}

function* handleMessages(data?: []) {
  const state: IObject<any> = yield select();

  const {chat} = state;
  const {messages} = chat;

  if (messages.data.length === 0)
    yield put(actions.setMessages(mapMessages(data)));
  else yield put(actions.setExtraMessages(mapMessages(data)));
}

function* getUsers() {
  try {
    const httpResponse: AxiosResponse = yield makeHttpRequest(
      apiConfig.App.users(),
    );
    if (httpResponse) {
      const {data} = mapResponseSuccessBein(httpResponse);
      yield put(actions.setUsers(data.map((item: any) => mapUser(item))));
    }
  } catch (e) {
    console.log('getUsers error', e);
  }
}
