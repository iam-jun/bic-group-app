import {AxiosRequestConfig} from 'axios';
import {
  IPayloadGetAttachmentFiles,
  IPayloadReactMessage,
} from '~/interfaces/IChat';
import {
  IAddUsersToGroupReq,
  ICreateDiretChatReq,
  ICreateRoomReq,
  IDeleteMessage,
  IEditMessageReq,
  IGetGroupReq,
  IGetGroupRolesReq,
  IGetMentionUsersReq,
  IGetMessageReq,
  IGetReactionStatisticsReq,
  IGetSurroundingMessages,
  IPaginationParams,
  IReadSubscription,
  IRealtimeAPIReq,
  IRemoveMemberReq,
  ISendMessageReq,
  IUpdateGroupName,
  ISearchChatReq,
  IUpdateConversationDescription,
} from '~/interfaces/IChatHttpRequest';
import {getChatAuthInfo} from '~/services/httpApiRequest';
import {getEnv} from '~/utils/env';

const providers = {
  bein: {
    url: getEnv('BEIN_API'),
    name: 'Bein',
  },
  chat: {
    url: getEnv('ROCKET_CHAT_API'),
    name: 'RocketChat',
  },
  getStream: {
    url: 'http://52.15.139.185:3000/',
    name: 'GetStream',
  },
};

const Upload = {
  uploadFile: (
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const uploadEndPoint: any = {
      userAvatar: 'upload/user-avatar',
      userCover: 'upload/user-cover',
      groupAvatar: 'upload/group-avatar',
      groupCover: 'upload/group-cover',
      postImage: 'upload/post-image',
      postVideo: 'upload/post-video',
      postFile: 'upload/post-file',
      commentImage: 'upload/comment-image',
      commentVideo: 'upload/comment-video',
      commentFile: 'upload/comment-file',
      chatImage: 'upload/chat-image',
      chatVideo: 'upload/chat-video',
      chatFile: 'upload/chat-file',
    };

    const url = `${providers.bein.url}${uploadEndPoint[type]}`;
    return {
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: false,
      provider: providers.bein,
      onUploadProgress: onUploadProgress,
      data,
    };
  },
};

const Chat = {
  rooms: (): HttpApiRequestConfig => {
    const auth = getChatAuthInfo();

    return {
      url: `${providers.bein.url}chat`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
      headers: {
        'X-Auth-Token': auth.accessToken,
        'X-User-Id': auth.userId,
      },
    };
  },
  createDirectChat: (data: ICreateDiretChatReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}im.create`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  createRoom: (data: ICreateRoomReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.create`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  addMembersToGroup: (
    id: string,
    data: IAddUsersToGroupReq,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}groups/${id}/users/add`,
      method: 'post',
      useRetry: true,
      provider: providers.bein,
      data,
    };
  },
  users: (params: IPaginationParams & {params: any}) => {
    return {
      url: `${providers.bein.url}users`,
      method: 'get',
      useRetry: true,
      provider: providers.bein,
      params,
    };
  },
  joinableUsers: (params: {
    groupId: number | string;
  }): HttpApiRequestConfig => ({
    url: `${providers.bein.url}groups/${params.groupId}/joinable-users`,
    method: 'get',
    provider: providers.bein,
    useRetry: true,
    params,
  }),
  messages: (params: IPaginationParams & {roomId: string; type?: string}) => {
    const endPoint = params?.type === 'direct' ? 'im' : 'groups';
    delete params.type;

    return {
      url: `${providers.chat.url}${endPoint}.history`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  members: (
    params: IPaginationParams & {roomId: string},
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}users.list`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  roles: (params: IGetGroupRolesReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.roles`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  subcriptions: (): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}subscriptions.get`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
    };
  },
  readSubscriptions: (data: IReadSubscription): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}subscriptions.read`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  sendMessage: (data: ISendMessageReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.sendMessage`,
      method: 'post',
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  deleteMessage: (data: IDeleteMessage): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.delete`,
      method: 'post',
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  groupInfo: (params: IGetGroupReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.info`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  updateGroupName: (data: IUpdateGroupName): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.rename`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  updateConversationDescription: (
    data: IUpdateConversationDescription,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.setDescription`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  uploadFile: (roomId: string, data: FormData): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}rooms.upload/${roomId}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  removeMember: (data: IRemoveMemberReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.kick`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  mentionUsers: (params: IGetMentionUsersReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}users.list`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  getChatInfo: (roomId: string): HttpApiRequestConfig => {
    const auth = getChatAuthInfo();

    return {
      url: `${providers.bein.url}chat/${roomId}/info`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
      headers: {
        'X-Auth-Token': auth.accessToken,
        'X-User-Id': auth.userId,
      },
    };
  },
  getAttachmentFiles: (
    data: IPayloadGetAttachmentFiles,
  ): HttpApiRequestConfig => {
    const {isDirectMessage, ...params} = data || {};
    const endpoint = isDirectMessage ? 'im.files' : 'groups.files';
    return {
      url: `${providers.chat.url}${endpoint}`,
      method: 'get',
      useRetry: false,
      provider: providers.chat,
      params,
    };
  },
  reactMessage: (data: IPayloadReactMessage): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.react`,
      method: 'post',
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  editMessage: (data: IEditMessageReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.update`,
      method: 'post',
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  getReactionStatistics: (
    params: IGetReactionStatisticsReq,
  ): HttpApiRequestConfig => {
    const auth = getChatAuthInfo();

    return {
      url: `${providers.bein.url}chat/reactions`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
      headers: {
        'X-Auth-Token': auth.accessToken,
        'X-User-Id': auth.userId,
      },
      params,
    };
  },
  getMessageDetail: (params: IGetMessageReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.getMessage`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  getSurroundingMessages: (
    params: IGetSurroundingMessages,
  ): HttpApiRequestConfig => {
    const auth = getChatAuthInfo();

    return {
      url: `${providers.bein.url}chat/surrounding-messages`,
      method: 'get',
      useRetry: true,
      provider: providers.bein,
      headers: {
        'X-Auth-Token': auth.accessToken,
        'X-User-Id': auth.userId,
      },
      params,
    };
  },
  getMessagesHistory: (data: IRealtimeAPIReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}method.call/loadHistory`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data: {message: JSON.stringify(data)},
    };
  },
  getNextMessages: (data: IRealtimeAPIReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}method.call/loadNextMessages`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data: {message: JSON.stringify(data)},
    };
  },
  search: (params?: ISearchChatReq): HttpApiRequestConfig => {
    const auth = getChatAuthInfo();
    return {
      url: `${providers.bein.url}chat/search`,
      method: 'get',
      useRetry: true,
      provider: providers.bein,
      headers: {
        'X-Auth-Token': auth.accessToken,
        'X-User-Id': auth.userId,
      },
      params,
    };
  },
};

const App = {
  info: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}hello/bein`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  tokens: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}auth/token`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  pushToken: (
    deviceToken: string,
    deviceOS: string,
    chatToken: string,
    chatUserId: string,
    appBundleId: string,
    deviceType: string,
    deviceName: string,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}notification/token`,
      method: 'post',
      provider: providers.bein,
      useRetry: true,
      headers: {
        'X-Auth-Token': chatToken,
        'X-User-Id': chatUserId,
      },
      data: {
        token: deviceToken,
        device_os: deviceOS,
        app_name: appBundleId,
        device_type: deviceType,
        device_name: deviceName,
      },
    };
  },
  removePushToken: (
    authToken: string,
    deviceOS: string,
    chatToken: string,
    chatUserId: string,
    appBundleId: string,
    deviceType: string,
    deviceName: string,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}notification/token`,
      method: 'delete',
      provider: providers.bein,
      useRetry: false,
      timeout: 5000,
      headers: {
        Authorization: authToken,
        'X-Auth-Token': chatToken,
        'X-User-Id': chatUserId,
      },
      data: {
        device_os: deviceOS,
        app_name: appBundleId,
        device_type: deviceType,
        device_name: deviceName,
      },
    };
  },
  getLinkPreview: (link: string): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}link-preview/${link}`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
};

export interface HttpApiRequestConfig extends AxiosRequestConfig {
  provider: Provider;
  useRetry: boolean;
}

export interface Provider {
  name: string;
  url: string;
}

export interface HttpApiResponseFormat {
  code: number;
  data?: any;
  meta?: any;
}

export interface FeedResponseError {
  message: string | any;
  error: {
    detail: string;
    status_code: number;
    code: number;
    exception: any;
    duration: any;
    more_info: any;
  };
  response: any;
}

export default {
  providers,

  App,
  Chat,
  Upload,
};
