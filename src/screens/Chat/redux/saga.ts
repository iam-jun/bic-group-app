import {StackActions} from '@react-navigation/native';
import {AxiosResponse} from 'axios';
import {put, select, takeLatest} from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {chatSocketId, messageEventTypes} from '~/constants/chat';
import {IObject} from '~/interfaces/common';
import {ICreateRoomReq} from '~/interfaces/IHttpRequest';
import {ISocketEvent} from '~/interfaces/ISocket';
import {withNavigation} from '~/router/helper';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {rootNavigationRef} from '~/router/navigator/refs';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {mapConversation, mapData, mapMessage} from './../helper';
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
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.CREATE_CONVERSATION, createConversation);
}

function* getData({
  dataType,
  payload,
}: {
  type: string;
  payload: any;
  reset: boolean;
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

    const result = mapData(auth.user, dataType, response.data[dataType]);

    if (data.length === 0) {
      yield put(actions.setData(dataType, result));
      if (result.length === appConfig.recordsPerPage)
        yield put(actions.getData(dataType, false, payload));
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
    yield put(actions.getData(dataType, false, params));
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

  switch (data.t) {
    case messageEventTypes.ADD_USER:
    case messageEventTypes.ROOM_CHANGED_ANNOUNCEMENT:
    case messageEventTypes.ROOM_CHANGED_DESCRIPTION:
    case messageEventTypes.ROOM_CHANGED_NAME:
    case messageEventTypes.ROOM_CHANGED_TOPIC:
      console.log('In development');
      break;
    // New message event doesn't have type
    default:
      yield put(actions.addNewMessage(mapMessage(data)));
      break;
  }
}
