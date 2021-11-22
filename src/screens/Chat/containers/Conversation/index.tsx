import Clipboard from '@react-native-clipboard/clipboard';
import {useIsFocused} from '@react-navigation/native';
import i18next from 'i18next';
import {debounce, isEmpty} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  InteractionManager,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import Header from '~/beinComponents/Header';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import {chatEvents, MessageOptionType, roomTypes} from '~/constants/chat';
import {ReactionType} from '~/constants/reactions';
import useAuth from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IMessage, IChatEvent} from '~/interfaces/IChat';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {
  ChatInput,
  ChatWelcome,
  DownButton,
  ListMessages,
  MessageContainer,
  MessageNotFound,
  MessageOptionsModal,
  UnreadBanner,
} from '~/screens/Chat/components';
import actions from '~/screens/Chat/redux/actions';
import {getConversations} from '~/selectors/chat';
import * as modalActions from '~/store/modal/actions';
import {showAlertNewFeature, showHideToastMessage} from '~/store/modal/actions';
import dimension from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {getLink, LINK_CHAT_MESSAGE} from '~/utils/link';
import LoadingMessages from '../../components/LoadingMessages';
import {getReactionStatistics} from '../../helper';

const _Conversation = ({route}: {route: any}) => {
  const {rootNavigation} = useRootNavigation();

  const roomId = route?.params?.roomId || '';
  const {user} = useAuth();
  const conversations = useSelector(state => getConversations(state));
  const conversation = useKeySelector(`chat.rooms.items.${roomId}`) || {};
  const messages = useKeySelector(`chat.messages.${roomId}`) || {};
  const unreadMessage = useKeySelector(`chat.unreadMessages.${roomId}`);
  const sub = useKeySelector(`chat.subscriptions.${roomId}`);
  const roomMessageData = messages?.data || [];

  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<any>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, insets);

  const isFocused = useIsFocused();
  const [isScrolled, setIsScrolled] = useState(false);
  const offsetY = useRef(0);
  /* Change room on the web component doesn't unmount
      Need to store roomId to compare nextProps and prevProps
  */
  const currentRoomId = useRef(roomId);
  const contentHeight = useRef(dimension.deviceHeight);
  const initiated = useRef(false);
  const [error, setError] = useState<string | null>(null);
  /* unread logic in the conversation detail
    is independent from the conversation list
  */
  const [unreadCount, setUnreadCount] = useState(0);

  const [downButtonVisible, setDownButtonVisible] = useState<boolean>(false);
  const _setDownButtonVisible = debounce(
    (value: boolean) => setDownButtonVisible(value),
    Platform.OS === 'web' ? 50 : 20,
  );

  const [unreadBannerVisible, setUnreadBannerVisible] =
    useState<boolean>(false);
  const listRef = useRef<FlatList>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage>();

  useEffect(() => {
    const eventEmmiter = DeviceEventEmitter.addListener(
      'chat-event',
      handleChatEvents,
    );

    // incase detect view items changed takes too long
    setTimeout(() => {
      if (!initiated.current && !isEmpty(roomMessageData)) initScroll();
    }, 5000);

    return () => {
      dispatch(actions.clearRoomMessages(roomId));
      dispatch(actions.setAttachmentMedia());
      eventEmmiter.remove();
    };
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!isFocused) {
        dispatch(actions.readSubscriptions(roomId));
      }
    });
  }, [isFocused]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (currentRoomId.current !== roomId && Platform.OS === 'web') {
        dispatch(actions.readSubscriptions(currentRoomId.current));
        dispatch(actions.clearRoomMessages(currentRoomId.current));
        currentRoomId.current = roomId;
        scrollToBottom(false);
      }
      if (roomId && !conversation.msgs) {
        setIsScrolled(false);
        setUnreadCount(sub?.unread || 0);
        getAttachments();
        dispatch(actions.getConversationDetail(roomId));
        dispatch(actions.readSubscriptions(roomId));
      }
    });
  }, [roomId]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!messages.loadingMore) jumpToMessage(route?.params?.message_id);
    });
  }, [route?.params?.message_id]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // mean conversation detail has been fetched
      if (conversation?.msgs && isEmpty(roomMessageData)) {
        getMessages(unreadCount);
        _setDownButtonVisible(unreadCount > appConfig.messagesPerPage);
      }
    });
  }, [conversation?.msgs]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setUnreadBannerVisible(unreadCount > 0);
    });
  }, [unreadCount]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!!error) {
        dispatch(
          showHideToastMessage({
            content: error,
            props: {
              textProps: {useI18n: true},
              type: 'error',
            },
          }),
        );
      }
    });
  }, [error]);

  const handleChatEvents = (event: IChatEvent) => {
    console.log('handleChatEvents', event);
    switch (event.type) {
      case chatEvents.KICK_ME_OUT:
        kickMeOut(event.payload);
        break;
      case chatEvents.NEW_MESSAGE:
        onNewMessage(event.payload);
        break;

        break;
    }
  };

  const onNewMessage = (params: {message: IMessage; index: number}) => {
    // if user scroll up, do not scroll to bottom automatically
    if (
      params.message.room_id === roomId &&
      offsetY.current >= contentHeight.current - dimension.deviceHeight - 100
    ) {
      listRef.current?.flashScrollIndicators();
      scrollToBottom(true, params.index);
    }
  };

  const kickMeOut = (id: string) => {
    if (roomId === id) {
      if (Platform.OS !== 'web') {
        rootNavigation.replace(chatStack.conversationList);
      } else {
        const _id =
          id === conversations[0]._id
            ? conversations[1]._id
            : conversations[0]._id;
        // navigate to the top conversation in the list
        rootNavigation.replace(chatStack.conversation, {
          roomId: _id,
        });
      }
    }
  };

  const getMessages = (unreadCount: number) => {
    if (!roomId) return;
    dispatch(actions.resetRoomMessages(roomId));
    if (route.params?.message_id) {
      dispatch(
        actions.getSurroundingMessages({
          roomId,
          messageId: route.params.message_id,
        }),
      );
    } else if (unreadCount > appConfig.messagesPerPage) {
      dispatch(actions.getUnreadMessage({...conversation, unreadCount}));
    } else if (conversation.msgs > 0) {
      dispatch(actions.getMessagesHistory(roomId));
    }
  };

  const getAttachments = useCallback(() => {
    const isDirectMessage = conversation?.type === roomTypes.DIRECT;
    if (roomId && conversation?._id && roomId === conversation?._id) {
      dispatch(actions.getAttachmentMedia({roomId, isDirectMessage}));
    }
  }, [conversation, roomId]);

  const loadMoreMessages = () => {
    if (roomId && !messages.loadingMore && messages.canLoadMore)
      dispatch(actions.getMessagesHistory(roomId));
  };

  const onOptionsClosed = () => {
    setSelectedMessage(undefined);
  };

  const onEmojiSelected = useCallback(
    (emoji: string, key: string, msgId: string) => {
      dispatch(modalActions.hideModal());
      if (key) {
        dispatch(
          actions.reactMessage({
            emoji: key,
            messageId: msgId,
            shouldReact: true,
          }),
        );
      }
    },
    [],
  );

  const onReactPress = useCallback(
    (event: any, item: IMessage, side: 'left' | 'right' | 'center') => {
      const payload = {
        isOpen: true,
        ContentComponent: (
          <EmojiBoard
            width={Platform.OS === 'web' ? 400 : dimension.deviceWidth}
            height={280}
            onEmojiSelected={(emoji: string, key: string) =>
              onEmojiSelected(emoji, key, item._id)
            }
          />
        ),
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
          position: {x: event?.pageX, y: event?.pageY},
          side: side,
        },
      };
      dispatch(modalActions.showModal(payload));
    },
    [],
  );

  const onReactionPress = useCallback(
    async (type: string) => {
      if (!!selectedMessage) {
        if (type === 'add_react') {
          onReactPress(null, selectedMessage, 'left');
        } else {
          dispatch(
            actions.reactMessage({
              emoji: type,
              messageId: selectedMessage._id,
              shouldReact: true,
            }),
          );
        }
      }

      messageOptionsModalRef.current?.close();
    },
    [selectedMessage],
  );

  const deleteMessage = () => {
    selectedMessage && dispatch(actions.deleteMessage(selectedMessage));
    setSelectedMessage(undefined);
  };

  const editMessage = () => {
    replyingMessage && onCancelReplyingMessage();
    selectedMessage && setEditingMessage(selectedMessage);
  };

  const viewReactions = () => {
    if (selectedMessage?.reaction_counts) {
      const payload: IPayloadReactionDetailBottomSheet = {
        isOpen: true,
        reactionCounts: selectedMessage.reaction_counts,
        initReaction: Object.keys(
          selectedMessage.reaction_counts,
        )[0] as ReactionType, // get the first emoji by default
        getDataParam: {messageId: selectedMessage._id},
        getDataPromise: getReactionStatistics,
      };
      dispatch(modalActions.showReactionDetailBottomSheet(payload));
    }
  };

  const getMessageLink = () => {
    Clipboard.setString(
      getLink(LINK_CHAT_MESSAGE, roomId, {
        message_id: selectedMessage?._id,
      }),
    );
    dispatch(
      showHideToastMessage({
        content: 'common:text_link_copied_to_clipboard',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      }),
    );
  };

  const jumpToMessage = useCallback(
    (messageId?: string) => {
      if (!roomId || !messageId) return;

      const index = roomMessageData.findIndex((id: string) => id === messageId);
      if (index >= 0) {
        dispatch(actions.setJumpedMessage(roomMessageData[index]));
        scrollToBottom(true, index);
      } else {
        dispatch(actions.resetRoomMessages(roomId));
        dispatch(actions.getSurroundingMessages({roomId, messageId}));
      }
    },
    [roomId, roomMessageData],
  );

  const onPressBack = useCallback(() => {
    if (route.params?.initial === false)
      rootNavigation.replace(chatStack.conversationList);
    else rootNavigation.goBack();
  }, []);

  const onReplyPress = useCallback(
    (item?: IMessage) => {
      editingMessage && onCancelEditingMessage();
      setReplyingMessage(item);
    },
    [editingMessage],
  );

  const onMenuPress = useCallback(
    (menu: MessageOptionType) => {
      switch (menu) {
        case 'delete':
          deleteMessage();
          break;
        case 'reply':
          onReplyPress(selectedMessage);
          break;
        case 'edit':
          editMessage();
          break;
        case 'reactions':
          viewReactions();
          break;
        case 'get_link':
          getMessageLink();
          break;
        default:
          dispatch(showAlertNewFeature());
          break;
      }
      messageOptionsModalRef.current?.close();
    },
    [selectedMessage],
  );

  const onSearchPress = () => {
    alert('Searching is in development');
  };

  const goConversationDetail = () => {
    rootNavigation.navigate(chatStack.conversationDetail, {
      roomId: conversation._id,
    });
  };

  const onLongPress = useCallback(
    (item: IMessage, position: {x: number; y: number}) => {
      setSelectedMessage(item);
      Keyboard.dismiss();
      messageOptionsModalRef.current?.open(position.x, position.y);
    },
    [],
  );

  const onCancelEditingMessage = useCallback(
    () => setEditingMessage(undefined),
    [],
  );

  const onCancelReplyingMessage = useCallback(
    () => setReplyingMessage(undefined),
    [],
  );

  const onViewableItemsChanged = (changed: any[]) => {
    if (
      unreadCount < appConfig.messagesPerPage &&
      unreadMessage &&
      changed &&
      changed.length > 0
    ) {
      const item = changed[0].item;

      if (item._id !== unreadMessage) {
        scrollToUnreadMessage();
      }
      setIsScrolled(true);
    }
    initiated.current = true;
  };

  const scrollToUnreadMessage = useCallback(() => {
    const unreadMessagePosition = roomMessageData.findIndex(
      (id: string) => id === unreadMessage,
    );
    if (roomMessageData.length > unreadMessagePosition) {
      scrollToBottom(true, unreadMessagePosition);
    }
  }, [roomMessageData]);

  const onCloseUnreadBannerPress = () => {
    setUnreadBannerVisible(false);
  };

  const scrollToIndexFailed = (e: any) => {
    setTimeout(
      () => listRef.current?.scrollToIndex({index: e.index, animated: true}),
      200,
    );
  };

  const scrollToBottom = (animated?: boolean, index?: number) => {
    if ((!index || index < 0) && isEmpty(roomMessageData)) return;
    try {
      listRef.current?.scrollToIndex({
        index: index || roomMessageData.length - 1,
        animated: animated || false,
      });
    } catch (e) {
      console.log('scrollToBottom', e);
    }
  };

  const onContentLayoutChange = () => {
    InteractionManager.runAfterInteractions(() => {
      if (messages.canLoadNext) _setDownButtonVisible(true);

      if (
        !isScrolled &&
        !isEmpty(roomMessageData) &&
        !messages.canLoadNext &&
        unreadCount === 0 &&
        !route.params?.message_id
      ) {
        initScroll();
      }
    });
  };

  const initScroll = () => {
    scrollToBottom(initiated.current);
    // only first time
    initiated.current = true;
    setIsScrolled(true);
  };

  const handleScroll = (event: any) => {
    InteractionManager.runAfterInteractions(() => {
      const _offsetY = event?.contentOffset.y;
      const _contentHeight = event?.contentSize.height;
      const delta = 1;
      const condition1 = _contentHeight - dimension.deviceHeight * 2 > _offsetY;
      const condition2 = messages.canLoadNext;
      _setDownButtonVisible(condition1 || condition2);
      offsetY.current = _offsetY;
      contentHeight.current = _contentHeight;

      if (initiated.current && _offsetY <= delta) {
        // reach top
        loadMoreMessages();
      }
    });
  };

  const scrollHandler = debounce(handleScroll, 10);

  const onScroll = (event: any) => {
    scrollHandler(event.nativeEvent);
  };

  const onEndReached = () => {
    if (!messages.loadingNext && messages.canLoadNext && roomId) {
      dispatch(actions.getNextMessages(roomId));
    } else if (unreadCount > 0) {
      setUnreadCount(0);
      dispatch(actions.setUnreadMessage({roomId, msgId: null}));
    }
  };

  const onDownPress = () => {
    _setDownButtonVisible(false);
    if (messages.canLoadNext) {
      setIsScrolled(false);
      setUnreadCount(0);
      dispatch(actions.setUnreadMessage({roomId, msgId: null}));
      getMessages(0);
    } else {
      scrollToBottom(true);
    }
  };

  const onSendCallBack = useCallback(() => {
    setIsScrolled(false);
  }, []);

  const renderItem = ({item, index}: {item: string; index: number}) => {
    const props = {
      previousMessageId: index > 0 && roomMessageData[index - 1],
      currentMessageId: item,
      index,
      roomId,
      onReactPress,
      onReplyPress,
      onLongPress,
      onQuotedMessagePress: jumpToMessage,
    };
    return <MessageContainer {...props} />;
  };

  const renderChatMessages = () => {
    if (messages.error) return <MessageNotFound />;
    if (
      (initiated.current && !messages.loading && isEmpty(roomMessageData)) ||
      conversation.msgs === 0
    )
      return <ChatWelcome type={conversation.type} />;

    // show loading until calculation has done and flatlist has scrolled
    return (
      <View style={styles.messagesContainer}>
        {((!initiated.current && !messages.canLoadNext) ||
          messages.loading) && <LoadingMessages />}

        {messages.loadingMore && <LoadingIndicator />}

        {!isEmpty(roomMessageData) && (
          <ListMessages
            listRef={listRef}
            nativeID={'list-messages'}
            data={roomMessageData}
            keyboardShouldPersistTaps="handled"
            onEndReachedThreshold={0.5}
            scrollEventThrottle={0.5}
            removeClippedSubviews={true}
            showsHorizontalScrollIndicator={false}
            maxToRenderPerBatch={appConfig.messagesPerPage}
            initialNumToRender={appConfig.messagesPerPage}
            contentContainerStyle={styles.listContainer}
            keyExtractor={item => item}
            /* means that the component will render the visible screen
        area plus (up to) 4999 screens above and 4999 below the viewport.*/
            windowSize={5000}
            ListFooterComponent={() => (
              <ViewSpacing height={theme.spacing.margin.large} />
            )}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            onScrollToIndexFailed={scrollToIndexFailed}
            onContentSizeChange={onContentLayoutChange}
            onEndReached={onEndReached}
            onScroll={onScroll}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
          />
        )}
        {messages.loadingNext && <LoadingIndicator />}
        <DownButton visible={downButtonVisible} onDownPress={onDownPress} />
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView testID="MessageScreen" style={styles.container}>
      <Header
        avatar={conversation?.avatar}
        avatarProps={{
          variant: 'default',
          cache: false,
          placeholderSource:
            conversation?.type === roomTypes.DIRECT
              ? images.img_user_avatar_default
              : images.img_group_avatar_default,
        }}
        title={
          messages.error
            ? i18next.t('chat:title_invalid_msg_link')
            : conversation.name
        }
        titleTextProps={{numberOfLines: 1, style: styles.headerTitle}}
        icon="search"
        onPressIcon={!messages.error ? onSearchPress : undefined}
        onPressHeader={!messages.error ? goConversationDetail : undefined}
        onPressBack={onPressBack}
        hideBackOnLaptop
      />
      <UnreadBanner
        count={unreadCount}
        time="now"
        visible={unreadBannerVisible}
        onPress={scrollToUnreadMessage}
        onClosePress={onCloseUnreadBannerPress}
      />
      {renderChatMessages()}
      <ChatInput
        roomId={roomId}
        editingMessage={editingMessage}
        replyingMessage={replyingMessage}
        onCancelEditing={onCancelEditingMessage}
        onCancelReplying={onCancelReplyingMessage}
        onSendCallback={onSendCallBack}
        onError={setError}
        onSentAttachment={getAttachments}
      />
      <MessageOptionsModal
        isMyMessage={selectedMessage?.user?.username === user?.username}
        ref={messageOptionsModalRef}
        selectedMessage={selectedMessage}
        onMenuPress={onMenuPress}
        onReactionPress={onReactionPress}
        onClosed={onOptionsClosed}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme, insets: EdgeInsets) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: insets.bottom,
    },
    messagesContainer: {
      flex: 1,
    },
    listContainer: {
      paddingBottom: 8,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    headerTitle: {
      marginEnd: spacing.margin.small,
    },
  });
};

const Conversation = React.memo(_Conversation);
Conversation.whyDidYouRender = true;

export default Conversation;
