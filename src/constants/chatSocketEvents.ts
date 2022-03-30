// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
const WebsocketEvents = {
  HELLO: 'hello',
  POSTED: 'posted',
  POST_EDITED: 'post_edited',
  POST_DELETED: 'post_deleted',
  POST_UNREAD: 'post_unread',
  CHANNEL_CONVERTED: 'channel_converted',
  CHANNEL_CREATED: 'channel_created',
  CHANNEL_DELETED: 'channel_deleted',
  CHANNEL_UNARCHIVED: 'channel_restored',
  CHANNEL_UPDATED: 'channel_updated',
  CHANNEL_VIEWED: 'channel_viewed',
};

export default WebsocketEvents;
