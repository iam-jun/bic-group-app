import {CommonActions, StackActions} from '@react-navigation/native';
import {AxiosResponse} from 'axios';
import i18next from 'i18next';
import {DeviceEventEmitter, Platform} from 'react-native';
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {appScreens} from '~/configs/navigator';
import {chatSocketId, messageEventTypes, roomTypes} from '~/constants/chat';
import {IToastMessage} from '~/interfaces/common';
import {
  IChatUser,
  IConversation,
  IMessage,
  IPayloadGetAttachmentFiles,
  IPayloadReactMessage,
  ISendMessageAction,
  IUpdateConversationDetail,
} from '~/interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';
import {withNavigation} from '~/router/helper';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {rootNavigationRef} from '~/router/navigator/refs';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import {makeHttpRequest} from '~/services/httpApiRequest';
import appActions from '~/store/app/actions';
import * as modalActions from '~/store/modal/actions';
import {generateRoomName} from '~/utils/generator';
import {
  mapConversation,
  mapConversations,
  mapData,
  mapMessage,
  mapMessages,
  mapRole,
  mapSubscriptions,
} from './../helper';
import actions from './actions';
import types from './constants';
/**
 * Chat
 * @param payload
 * @returns {IterableIterator<*>}
 */

const navigation = withNavigation(rootNavigationRef);

export default function* saga() {
  yield takeLatest(types.INIT_CHAT, initChat);
  yield takeLatest(types.GET_DATA, getData);
  yield takeLatest(types.MERGE_EXTRA_DATA, mergeExtraData);
  yield takeLatest(types.GET_ROOMS, getRooms);
  yield takeLatest(types.GET_MESSAGES_HISTORY, getMessagesHistory);
  yield takeLatest(types.GET_NEXT_MESSAGES, getNextMessages);
  yield takeLatest(types.GET_UNREAD_MESSAGE, getUnreadMessage);
  yield takeLatest(types.GET_GROUP_ROLES, getGroupRoles);
  yield takeLatest(types.GET_CONVERSATION_DETAIL, getConversationDetail);
  yield takeLatest(types.GET_ATTACHMENT_MEDIA, getAttachmentMedia);
  yield takeLatest(types.HANDLE_EVENT, handleEvent);
  yield takeLatest(types.CREATE_CONVERSATION, createConversation);
  yield takeEvery(types.SEND_MESSAGE, sendMessage);
  yield takeEvery(types.EDIT_MESSAGE, editMessage);
  yield takeLatest(types.DELETE_MESSAGE, deleteMessage);
  yield takeLatest(types.UPLOAD_FILE, uploadFile);
  yield takeLatest(types.RETRY_SEND_MESSAGE, retrySendMessage);
  yield takeLatest(types.GET_SUBSCRIPTIONS, getSubscriptions);
  yield takeLatest(types.READ_SUBCRIPTIONS, readSubscriptions);
  yield takeLatest(types.UPDATE_CONVERSATION_NAME, updateConversationName);
  yield takeLatest(types.UPDATE_CONVERSATION_DETAIL, updateConversationDetail);
  yield takeLatest(types.ADD_MEMBERS_TO_GROUP, addMembersToGroup);
  yield takeLatest(types.REMOVE_MEMBER, removeMember);
  yield takeLatest(types.REACT_MESSAGE, reactMessage);
  yield takeEvery(types.GET_MESSAGE_DETAIL, getMessageDetail);
  yield takeLatest(types.GET_SURROUNDING_MESSAGES, getSurroundingMessages);
  yield takeLatest(
    types.TOGGLE_CONVERSATION_NOTIFICATIONS,
    toggleConversationNotifications,
  );
  yield takeLatest(types.LEAVE_CHAT, leaveChat);
}

function* initChat() {
  yield put(actions.getSubscriptions());
  yield put(actions.getRooms());
}

function* getData({
  dataType,
  payload,
  field,
}: {
  type: string;
  payload: any;
  field?: string;
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
      const page = payload?.count || appConfig.recordsPerPage;
      if (result.length === page)
        yield put(actions.getData(dataType, payload, field));
    } else {
      yield put(actions.setExtraData(dataType, result));
    }
  } catch (err) {
    console.error('getData', dataType, err);
  }
}

function* mergeExtraData({
  dataType,
  field,
}: {
  type: string;
  dataType: string;
  field?: string;
}) {
  const {chat} = yield select();
  const {canLoadMore, loading, params} = chat[dataType];
  if (!loading && canLoadMore) {
    yield put(actions.getData(dataType, params, field));
  }
}

function* getRooms() {
  try {
    const {auth} = yield select();

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.rooms(),
    );
    const data = response.data.data.map((item: any) => item._id);
    const items = mapConversations(auth.user, response.data.data);
    yield put(actions.setRooms({data, items}));
  } catch (err: any) {
    console.error('getRooms', err);
  }
}

function* getGroupRoles({payload}: {type: string; payload: string}) {
  try {
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.roles({
        roomId: payload,
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

    yield put(
      actions.setSubscriptions(mapSubscriptions(response.data?.update)),
    );
  } catch (err) {
    console.log('getSubscriptions', err);
  }
}

function* readSubscriptions({payload}: {type: string; payload: string}) {
  try {
    yield makeHttpRequest(
      apiConfig.Chat.readSubscriptions({
        rid: payload,
      }),
    );
    yield getSubscriptions();
  } catch (err) {
    console.log('readSubscriptions', err);
  }
}

function* getConversationDetail({payload}: {type: string; payload: string}) {
  try {
    const {auth} = yield select();

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getChatInfo(payload),
    );

    const _conversation = mapConversation(auth.user, response.data?.data);

    yield put(actions.setConversationDetail(_conversation));
    yield put(appActions.setRootScreenName(`${appScreens.chat}/${payload}`));
  } catch (err) {
    console.log('getConversationDetail', err);
  }
}

function* getAttachmentMedia({
  payload,
}: {
  type: string;
  payload: IPayloadGetAttachmentFiles;
}) {
  try {
    payload.query = {typeGroup: 'image'};
    payload.sort = {uploadedAt: -1};
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getAttachmentFiles(payload),
    );
    const {files} = response?.data || {};
    yield put(actions.setAttachmentMedia(files || []));
  } catch (err: any) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* createConversation({
  payload,
  hideConfirmation,
  callBack,
  conversationName,
}: {
  payload: IChatUser[];
  type: string;
  hideConfirmation?: boolean;
  callBack?: (roomId: string) => void;
  conversationName?: string;
}) {
  try {
    const {auth, chat} = yield select();
    const {user} = auth;
    const {rooms} = chat;

    let response: AxiosResponse | null = null;
    if (payload.length === 1) {
      const existedRoom = Object.keys(rooms.items).find(
        (key: string) =>
          rooms.items[key].type === roomTypes.DIRECT &&
          (rooms.items[key].usernames || []).includes(payload[0].username),
      );
      if (existedRoom) {
        if (callBack) return callBack(rooms.items[existedRoom]?._id);
        if (hideConfirmation) {
          navigation.replace(chatStack.conversation, {
            roomId: rooms.items[existedRoom]._id,
            initial: false,
          });
        } else {
          yield put(
            modalActions.showAlert({
              title: i18next.t('common:text_error'),
              content: i18next.t('chat:error:existing_direct_chat'),
              confirmLabel: i18next.t('common:text_ok'),
              onConfirm: () => {
                navigation.replace(chatStack.conversation, {
                  roomId: rooms.items[existedRoom]._id,
                  initial: false,
                });
              },
            }),
          );
        }

        return;
      }
      response = yield makeHttpRequest(
        apiConfig.Chat.createDirectChat({username: payload[0].username}),
      );
    } else {
      const name =
        conversationName ||
        generateRoomName(
          user,
          payload.map((_user: IChatUser) => _user?.name),
        );

      const members = [...payload, user];

      const data = {
        name,
        members: payload.map((user: IChatUser) => user.username),
        customFields: {
          type: roomTypes.QUICK,
          usernames: members.map((user: IChatUser) => user.username),
          members: payload.length === 1 ? members : null,
        },
      };
      response = yield makeHttpRequest(apiConfig.Chat.createRoom(data));
    }

    const conversation = mapConversation(
      auth.user,
      payload.length === 1 ? response?.data?.room : response?.data?.group,
    );

    if (callBack) return callBack(conversation._id);

    rootNavigationRef?.current?.dispatch(state => {
      // Remove the createConversation route from the stack
      const routes = state.routes.filter(
        r => r.name !== chatStack.createConversation,
      );

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });

    rootNavigationRef?.current?.dispatch(
      StackActions.replace(chatStack.conversation, {
        roomId: conversation._id,
        initial: false,
      }),
    );
    yield put(actions.clearSelectedUsers());
  } catch (err: any) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* uploadFile({payload}: {payload: IMessage; type: string}) {
  try {
    if (!payload.attachment) return;
    const {auth} = yield select();

    const formData = new FormData();
    if (Platform.OS === 'web') {
      formData.append(
        'file',
        // @ts-ignore
        payload.attachment,
        payload.attachment.name || 'fileMessage',
      );
    } else {
      formData.append('file', {
        type: payload.attachment.type,
        //@ts-ignore
        name: payload.attachment.name || 'fileMessage',
        uri: payload.attachment.uri,
      });
    }

    formData.append(
      'description',
      JSON.stringify({
        localId: payload.localId,
        size: payload.attachment.size,
        type: payload.attachment.type,
      }),
    );

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.uploadFile(payload.room_id, formData),
    );

    const message = mapMessage(auth.user, response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    console.log('uploadFile', err);
    yield put(actions.sendMessageFailed(payload));
  }
}

function* sendMessage({payload}: {payload: ISendMessageAction; type: string}) {
  const {_id, room_id, text, replyingMessage} = payload || {};
  try {
    const {auth} = yield select();

    const attachments = [];
    if (replyingMessage) {
      attachments.push({
        description: JSON.stringify({
          type: 'reply',
          msgId: replyingMessage._id,
          author: replyingMessage.user.username,
        }),
      });
    }
    // if (image) {
    //   attachments.push({
    //     image_url: image.name,
    //     image_dimensions: {width: image.width, height: image.height},
    //   });
    // }

    const params = {message: {_id, rid: room_id, msg: text, attachments}};
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.sendMessage(params),
    );

    const message = mapMessage(auth.user, response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message} as IMessage));
  } catch (err) {
    yield put(actions.sendMessageFailed(payload));
  }
}

function* editMessage({payload}: {payload: IMessage; type: string}) {
  try {
    const {auth} = yield select();

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.editMessage({
        roomId: payload.room_id,
        msgId: payload._id,
        text: payload.text || '',
      }),
    );

    const message = mapMessage(auth.user, response.data.message);
    yield put(actions.sendMessageSuccess({...payload, ...message}));
  } catch (err) {
    yield put(actions.sendMessageFailed(payload));
  }
}

function* deleteMessage({payload}: {payload: IMessage; type: string}) {
  try {
    yield makeHttpRequest(
      apiConfig.Chat.deleteMessage({
        roomId: payload.room_id,
        msgId: payload._id,
      }),
    );
  } catch (err: any) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* updateConversationName({
  payload,
}: {
  type: string;
  payload: {roomId: string; name: string};
}) {
  try {
    yield makeHttpRequest(apiConfig.Chat.updateGroupName(payload));
  } catch (err) {
    console.log('updateConversationName', err);
    yield showError(err);
  }
}

function* updateConversationDetail({
  payload,
}: {
  type: string;
  payload: {
    roomId: number | string;
    body: IUpdateConversationDetail;
    editFieldName?: string;
    callback?: (roomId?: number | string) => void;
  };
}) {
  try {
    const {name, description, avatar, cover} = payload.body;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.updateConversationDetail(payload.roomId, {
        name,
        description,
        icon: avatar,
        background_img_url: cover,
      }),
    );
    if (!response?.data) {
      throw new Error(response?.data);
    }

    payload?.callback?.(payload.roomId);

    // show success toast message
    let toastContent: string;
    if (payload.editFieldName) {
      toastContent = `${payload.editFieldName} ${i18next.t(
        'settings:text_updated_successfully',
      )}`;
    } else {
      toastContent = 'common:text_edit_success';
    }
    const toastMessage: IToastMessage = {
      content: toastContent,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log('updateConversationDetail', err);
    yield showError(err);
  }
}

function* addMembersToGroup({
  payload,
}: {
  type: string;
  payload: {roomId: number; userIds: number[]};
}) {
  try {
    yield makeHttpRequest(
      apiConfig.Chat.addMembersToGroup(payload.roomId, {
        user_ids: payload.userIds,
      }),
    );
    handleAddMember();
  } catch (err: any) {
    yield put(
      modalActions.showAlert({
        title: i18next.t('common:text_error'),
        content: err?.message || err,
        confirmLabel: i18next.t('common:text_ok'),
      }),
    );
  }
}

function* removeMember({
  payload,
}: {
  type: string;
  payload: {
    roomId: string;
    user: IChatUser;
  };
}) {
  try {
    const {chat} = yield select();
    const conversation = chat?.rooms?.items[payload.roomId] || {};

    if (conversation.type === roomTypes.GROUP) {
      yield groupsDataHelper.removeUsers(
        conversation.beinGroupId,
        [payload.user.username],
        'usernames',
      );
    } else {
      const data = {
        roomId: conversation._id,
        userId: payload.user._id.toString(),
      };
      yield makeHttpRequest(apiConfig.Chat.removeMember(data));
    }
  } catch (err) {
    console.log('removeMember', err);
  }
}

function* reactMessage({
  payload,
}: {
  type: string;
  payload: IPayloadReactMessage;
}) {
  try {
    yield makeHttpRequest(apiConfig.Chat.reactMessage(payload));
  } catch (err) {
    console.log('reactMessage:', err);
    yield showError(err);
  }
}

function* retrySendMessage({payload, type}: {payload: IMessage; type: string}) {
  if (payload.attachment) yield uploadFile({payload, type});
  else if (payload.createdAt) yield editMessage({payload, type});
  //@ts-ignore
  else yield sendMessage({payload, type});
}

function* getMessageDetail({payload}: {payload: string; type: string}) {
  try {
    const {auth} = yield select();
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getMessageDetail({
        msgId: payload,
      }),
    );
    yield put(
      actions.setMessageDetail(mapMessage(auth.user, response.data.message)),
    );
  } catch (err) {
    console.error('getMessageDetail', err);
  }
}

function* getUnreadMessage({payload}: {type: string; payload: IConversation}) {
  try {
    const {auth} = yield select();
    const response: AxiosResponse = yield makeHttpRequest(
      //@ts-ignore
      apiConfig.Chat.messages({
        roomId: payload._id,
        type: payload.type,
        count: 1,
        offset: payload.unreadCount,
      }),
    );
    const message = mapMessage(auth.user, response.data.messages[0]);
    yield put(
      actions.setUnreadMessage({roomId: payload._id, msgId: message._id}),
    );
    yield put(
      actions.getSurroundingMessages({
        roomId: payload._id,
        messageId: message._id,
      }),
    );
  } catch (err) {
    console.error('getUnreadMessage', err);
  }
}

function* getSurroundingMessages({
  payload,
}: {
  type: string;
  payload: {roomId: string; messageId: string};
}) {
  try {
    const {auth} = yield select();
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getSurroundingMessages({
        room_id: payload.roomId,
        message_id: payload.messageId,
        count: appConfig.messagesPerPage,
      }),
    );

    const result = response.data.data;

    const messageIds = result.map((item: any) => item._id).reverse();

    const messagesData = mapMessages(auth.user, result);

    if (result.length === 0) return;

    const index = messageIds.findIndex(
      (item: string) => item === payload.messageId,
    );
    yield put(
      actions.setMessagesHistory({
        roomId: payload.roomId,
        messageIds: messageIds.slice(0, index + 1).reverse(),
        messagesData,
      }),
    );

    yield put(actions.setJumpedMessage(messageIds[index]));
  } catch (err) {
    console.log('getSurroundingMessages', err);
    yield put(actions.setMessagesError(err));
  }
}

function* getMessagesHistory({payload}: {type: string; payload: string}) {
  try {
    const {auth, chat} = yield select();

    const {rooms, messages: messagesData} = chat;
    const messages = messagesData?.[payload] || {};
    const conversation = rooms.items?.[payload] || {};

    const data = messages.data || [];
    const items = messages.items || {};
    const lastDate =
      data.length > 0
        ? {
            $date: new Date(items[data[0]].createdAt).getTime(),
          }
        : null;
    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getMessagesHistory({
        msg: 'method',
        method: 'loadHistory',
        id: payload,
        params: [
          payload,
          lastDate,
          appConfig.messagesPerPage,
          {$date: new Date().getTime()},
        ],
      }),
    );
    const result = JSON.parse(response.data.message);
    const resultData = result.result?.messages;
    const messageIds = resultData.map((item: any) => item._id).reverse();

    const messagesResult = mapMessages(auth.user, resultData);

    if (data.length === 0 && conversation.unreadCount < messagesResult.length) {
      yield put(
        actions.setUnreadMessage({
          roomId: payload,
          msgId: messageIds[messageIds.length - conversation.unreadCount],
        }),
      );
    }
    yield put(
      actions.setMessagesHistory({
        roomId: payload,
        messageIds,
        messagesData: messagesResult,
      }),
    );
  } catch (err: any) {
    console.log('getMessagesHistory', err);
  }
}

function* getNextMessages({payload}: {type: string; payload: string}) {
  try {
    const {auth, chat} = yield select();

    const {messages: messagesData} = chat;
    const messages = messagesData?.[payload] || {};

    const data = messages.data || [];
    const items = messages.items || {};
    const lastDate =
      data.length > 1
        ? {
            $date: new Date(items[data[data.length - 1]].createdAt).getTime(),
          }
        : null;

    const response: AxiosResponse = yield makeHttpRequest(
      apiConfig.Chat.getNextMessages({
        msg: 'method',
        method: 'loadNextMessages',
        id: payload,
        params: [payload, lastDate, appConfig.messagesPerPage],
      }),
    );
    const result = JSON.parse(response.data.message);
    const resultData = result.result?.messages;
    const messageIds = resultData.map((item: any) => item._id);

    const _messages = mapMessages(auth.user, resultData);
    yield put(
      actions.setNextMessages({
        roomId: payload,
        messageIds,
        messagesData: _messages,
      }),
    );
  } catch (err: any) {
    console.log('getNextMessages', err);
  }
}

function* leaveChat({payload}: {type: string; payload: string}) {
  try {
    const {chat} = yield select();

    const conversation = chat?.rooms?.items[payload] || {};
    const roomId =
      conversation.type !== roomTypes.GROUP
        ? conversation._id
        : conversation.beinGroupId;

    if (conversation.type !== roomTypes.GROUP) {
      yield makeHttpRequest(apiConfig.Chat.leaveQuickChat(roomId));
    } else {
      yield groupsDataHelper.leaveGroup(Number(roomId));
      yield put(groupsActions.getJoinedGroups());
      yield put(groupsActions.getGroupDetail(Number(roomId)));
    }

    if (Platform.OS === 'web') {
      // navigate to the top conversation in the list
      const {chat} = yield select();
      const {data, items} = chat.rooms;
      const roomData = data.sort(function (a: string, b: string) {
        //@ts-ignore
        return new Date(items[b]._updatedAt) - new Date(items[a]._updatedAt);
      });
      navigation.navigate(chatStack.conversation, {roomId: roomData[0]?._id});
    }

    const toastMessage: IToastMessage = {
      content: i18next.t('chat:modal_confirm_leave_chat:success_message'),
      props: {
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log('leaveChat', err);
  }
}

function* toggleConversationNotifications({
  payload,
}: {
  type: string;
  payload: {roomId: string; currentDisableNotifications: boolean};
}) {
  try {
    const {roomId, currentDisableNotifications} = payload;
    const newDisableNotifications = !currentDisableNotifications;

    yield makeHttpRequest(
      apiConfig.Chat.setConversationNotifications(
        roomId,
        newDisableNotifications,
      ),
    );

    yield put(
      actions.setConversationNotifications({
        roomId,
        disableNotifications: newDisableNotifications,
      }),
    );
  } catch (error) {
    yield showError(error);
  }
}

function* handleEvent({payload}: {type: string; payload: ISocketEvent}) {
  /* Because subscription "stream-room-messages" event
      always return id: "id" so we can't handle it by id.
      [TO-DO] Need to check with BE
  */

  if (payload.msg === 'changed') {
    if (payload.collection === 'stream-room-messages')
      yield handleRoomsMessage(payload);
    else if (payload.collection === 'stream-notify-user')
      yield handleNotifyUser(payload);
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

function* handleNewMessage(data: any) {
  try {
    const {chat, auth} = yield select();
    const {rooms, messages, unreadMessage} = chat;
    const message = mapMessage(auth.user, data);
    const conversation = rooms.items[message?.room_id];
    const msgId = message?._id || message?.localId || '';
    const roomMessages = messages?.[message.room_id];
    const include = roomMessages?.items?.[msgId];

    const haveUnreadMessages =
      unreadMessage && conversation.unreadCount > appConfig.messagesPerPage;

    if (conversation) {
      if (!include && roomMessages) {
        if (!haveUnreadMessages) {
          yield put(actions.addNewMessage(message));
          DeviceEventEmitter.emit('chat-new-message', {
            message,
            index: roomMessages.data.length,
          });
        }
      } else {
        yield put(actions.updateMessage(message));
      }
    } else {
      const response: AxiosResponse = yield makeHttpRequest(
        apiConfig.Chat.groupInfo({
          roomId: message?.room_id,
        }),
      );
      yield put(
        actions.createConversationSuccess(
          mapConversation(auth.user, response.data?.group),
        ),
      );
      yield getSubscriptions();
    }
  } catch (err) {
    console.log('handleNewMessage', err);
  }
}

function* handleRemoveUser(data: any) {
  try {
    const {auth} = yield select();
    const message = mapMessage(auth.user, data);

    yield handleNewMessage(data);
    yield put(actions.removeMemberSuccess(message));
  } catch (err) {
    console.log('handleRemoveUser', err);
  }
}

function* handleRemoveMessage(data: any) {
  try {
    const {auth} = yield select();
    const message = mapMessage(auth.user, data);
    yield put(actions.deleteMessageSuccess(message));
  } catch (err) {
    console.log('handleRemoveMessage', err);
  }
}

function* handleAddNewRoom(data: any) {
  try {
    const {auth} = yield select();

    yield getSubscriptions();
    yield put(
      actions.createConversationSuccess(mapConversation(auth.user, data)),
    );
    yield put(groupsActions.getJoinedGroups());
  } catch (err) {
    console.log('handleAddNewRoom', err);
  }
}

function* handleChangeDescription(data: any) {
  yield put(
    actions.setUpdatedConversationDetail({
      _id: data.rid,
      description: data.msg,
    }),
  );
}

function* handleRoomsMessage(payload?: any) {
  const data = payload.fields.args[0];

  switch (data.t) {
    case messageEventTypes.ROOM_CHANGED_DESCRIPTION:
      yield handleChangeDescription(data);
      yield handleNewMessage(data);
      break;
    case messageEventTypes.ROOM_CHANGED_ANNOUNCEMENT:
    case messageEventTypes.ROOM_CHANGED_NAME:
    case messageEventTypes.ROOM_CHANGED_TOPIC:
    case messageEventTypes.USER_LEFT:
    case undefined:
      yield handleNewMessage(data);
      break;
    case messageEventTypes.ADD_USER:
      yield handleNewMessage(data);
      yield put(actions.addMembersToGroupSuccess(data));
      break;
    case messageEventTypes.REMOVE_MESSAGE:
      yield handleRemoveMessage(data);
      break;
    case messageEventTypes.REMOVE_USER:
      yield handleRemoveUser(data);
      break;
  }
}

function* handleNotifyUser(payload?: any) {
  const data = payload.fields.args || [];
  switch (data[0]) {
    case 'removed':
      {
        yield put(actions.kickMeOut(data[1]));
        DeviceEventEmitter.emit('chat-kick-me', data[1].rid);
        yield put(groupsActions.getJoinedGroups());
      }
      break;
    case 'inserted':
      yield handleAddNewRoom(data[1]);
      break;
    case 'updated':
      yield put(actions.updateSubscription(data[1]));
      break;
  }
}

function* showError(err: any) {
  const toastMessage: IToastMessage = {
    content:
      err?.meta?.message ||
      err?.meta?.errors?.[0]?.message ||
      'common:text_error_message',
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(modalActions.showHideToastMessage(toastMessage));
}
