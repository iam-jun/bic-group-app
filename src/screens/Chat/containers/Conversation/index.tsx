import Clipboard from '@react-native-clipboard/clipboard';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import i18next from 'i18next';
import {debounce, isEmpty} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import {useDispatch} from 'react-redux';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import Header from '~/beinComponents/Header';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import {MessageOptionType, roomTypes} from '~/constants/chat';
import {ReactionType} from '~/constants/reactions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IMessage} from '~/interfaces/IChat';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {RootStackParamList} from '~/interfaces/IRouter';
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
import * as modalActions from '~/store/modal/actions';
import {showAlertNewFeature, showHideToastMessage} from '~/store/modal/actions';
import dimension from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {getLink, LINK_CHAT_MESSAGE} from '~/utils/link';
import LoadingMessages from '../../components/LoadingMessages';
import {getReactionStatistics} from '../../helper';

const _Conversation = () => {
  const {user} = useAuth();
  const {conversation, messages, unreadMessagePosition} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<any>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme, insets);
  const {rootNavigation} = useRootNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Conversation'>>();

  const isFocused = useIsFocused();
  const [isScrolled, setIsScrolled] = useState(false);
  const offsetY = useRef(0);
  const initiated = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [downButtonVisible, setDownButtonVisible] = useState<boolean>(false);
  const [unreadBannerVisible, setUnreadBannerVisible] =
    useState<boolean>(false);
  const listRef = useRef<FlatList>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage>();

  useEffect(() => {
    const emmiterCallback = (index: number) => {
      listRef.current?.flashScrollIndicators();
      scrollToBottom(true, index);
    };

    const _emmiter = DeviceEventEmitter.addListener(
      'chat-new-message',
      emmiterCallback,
    );
    return () => {
      dispatch(actions.setAttachmentMedia());
      _emmiter.remove();
    };
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!isFocused) {
        dispatch(actions.readSubscriptions(conversation._id));
      }
    });
  }, [isFocused]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (route?.params?.roomId) {
        dispatch(actions.getConversationDetail(route.params.roomId));
        dispatch(actions.readSubscriptions(route.params.roomId));
      }
    });
  }, [route?.params?.roomId]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!messages.loading) jumpToMessage(route?.params?.message_id);
    });
  }, [route?.params?.message_id]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const roomId = route?.params?.roomId;
      const isDirectMessage = conversation?.type === roomTypes.DIRECT;
      if (roomId && conversation?._id && roomId === conversation?._id) {
        dispatch(actions.getAttachmentMedia({roomId, isDirectMessage}));
      }
      getAttachments();
    });
  }, [route?.params?.roomId, conversation?._id]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // mean conversation detail has been fetched
      if (conversation?.msgs) {
        setIsScrolled(false);
        getMessages(conversation.unreadCount);
        setDownButtonVisible(
          conversation.unreadCount > appConfig.messagesPerPage,
        );
      }
    });
  }, [conversation?.msgs]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setUnreadBannerVisible(
        conversation?.unreadCount && conversation.unreadCount > 0,
      );
    });
  }, [conversation?.unreadCount]);

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

  const getMessages = (unreadCount: number) => {
    if (route.params?.message_id) {
      dispatch(actions.getSurroundingMessages(route.params.message_id));
    } else if (unreadCount > appConfig.messagesPerPage) {
      dispatch(actions.getUnreadMessage());
    } else if (conversation.msgs > 0) {
      dispatch(actions.getMessagesHistory());
    }
  };

  const getAttachments = () => {
    const roomId = route?.params?.roomId;
    const isDirectMessage = conversation?.type === roomTypes.DIRECT;
    if (roomId && conversation?._id && roomId === conversation?._id) {
      dispatch(actions.getAttachmentMedia({roomId, isDirectMessage}));
    }
  };

  const loadMoreMessages = () => {
    if (!messages.loading) dispatch(actions.mergeMessagesHistory());
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
      getLink(LINK_CHAT_MESSAGE, route.params?.roomId, {
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

  const jumpToMessage = useCallback((messageId?: string) => {
    if (!messageId) return;

    const index = messages.data.findIndex(
      (item: IMessage) => item._id === messageId,
    );
    if (index >= 0) {
      dispatch(actions.setJumpedMessage(messages.data[index]));
      listRef.current?.scrollToIndex({index, animated: true});
    } else {
      // dispatch(actions.resetData('messages'));
      dispatch(actions.getSurroundingMessages(messageId));
    }
  }, []);

  const onPressBack = useCallback(async () => {
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
    async (menu: MessageOptionType) => {
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

  const onSearchPress = async () => {
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

  const onCancelEditingMessage = () => setEditingMessage(undefined);

  const onCancelReplyingMessage = () => setReplyingMessage(undefined);

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const props = {
      previousMessage: index > 0 && messages.data[index - 1],
      currentMessage: item,
      index,
      onReactPress,
      onReplyPress,
      onLongPress,
      onQuotedMessagePress: jumpToMessage,
    };
    return <MessageContainer {...props} />;
  };

  const onViewableItemsChanged = (changed: any[]) => {
    if (
      conversation.unreadCount < appConfig.messagesPerPage &&
      messages.unreadMessage &&
      changed &&
      changed.length > 0
    ) {
      const item = changed[0].item;

      if (
        item._id !== messages.unreadMessage?._id &&
        messages.data.length > unreadMessagePosition
      ) {
        listRef.current?.scrollToIndex({
          index: unreadMessagePosition,
          animated: false,
        });
      }
      setIsScrolled(true);
    }
    initiated.current = true;
  };

  const onUnreadBannerPress = () => {
    try {
      listRef.current?.scrollToIndex({
        index: unreadMessagePosition,
        animated: true,
      });
    } catch (e: any) {
      scrollToIndexFailed({index: unreadMessagePosition});
    }
  };

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
    if ((!index || index < 0) && isEmpty(messages.data)) return;

    listRef.current?.scrollToIndex({
      index: index || messages.data.length - 1,
      animated: animated || false,
    });
  };

  const onContentLayoutChange = () => {
    InteractionManager.runAfterInteractions(() => {
      if (messages.canLoadNext) setDownButtonVisible(true);
      if (
        !isScrolled &&
        !isEmpty(messages.data) &&
        // !messages.loading &&
        !messages.canLoadNext &&
        conversation.unreadCount === 0 &&
        !route.params?.message_id
      ) {
        scrollToBottom(initiated.current);
        // only first time
        initiated.current = true;
        setIsScrolled(true);
      }
    });
  };

  const handleScroll = (event: any) => {
    InteractionManager.runAfterInteractions(() => {
      const _offsetY = event?.contentOffset.y;
      const contentHeight = event?.contentSize.height;
      const delta = 0;
      const condition1 = contentHeight - dimension.deviceHeight * 2 > _offsetY;
      const condition2 = messages.canLoadNext;
      setDownButtonVisible(condition1 || condition2);
      offsetY.current = _offsetY;

      if (
        initiated.current &&
        !messages.loadingMore &&
        !isEmpty(messages.extra) &&
        _offsetY <= delta
      ) {
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
    if (!messages.loadingNext && messages.canLoadNext) {
      dispatch(actions.getNextMessages());
    } else if (conversation.unreadCount > 0) {
      dispatch(actions.readConversation());
    }
  };

  const onDownPress = () => {
    setDownButtonVisible(false);
    if (messages.canLoadNext) {
      setIsScrolled(false);
      dispatch(actions.readConversation());
      dispatch(actions.resetData('messages'));
      getMessages(0);
    } else {
      scrollToBottom(true);
    }
  };

  const onSendCallBack = () => {
    setIsScrolled(false);
  };

  const renderChatMessages = () => {
    if (messages.error) return <MessageNotFound />;
    if (!messages.loading && conversation.msgs === 0)
      return <ChatWelcome type={conversation.type} />;

    // show loading until calculation has done and flatlist has scrolled
    return (
      <View style={styles.messagesContainer}>
        {!initiated.current && !messages.canLoadNext && <LoadingMessages />}

        {messages.loadingMore && <LoadingIndicator />}

        {!messages.loading && (
          <ListMessages
            listRef={listRef}
            nativeID={'list-messages'}
            data={messages.data}
            keyboardShouldPersistTaps="handled"
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={0.5}
            removeClippedSubviews={true}
            onScrollToIndexFailed={scrollToIndexFailed}
            onContentSizeChange={onContentLayoutChange}
            onScroll={onScroll}
            showsHorizontalScrollIndicator={false}
            maxToRenderPerBatch={appConfig.messagesPerPage}
            initialNumToRender={appConfig.messagesPerPage}
            contentContainerStyle={styles.listContainer}
            /* means that the component will render the visible screen
        area plus (up to) 4999 screens above and 4999 below the viewport.*/
            windowSize={5000}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            onViewableItemsChanged={onViewableItemsChanged}
            ListFooterComponent={() => (
              <ViewSpacing height={theme.spacing.margin.large} />
            )}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
              // waitForInteraction: true,
              // viewAreaCoveragePercentThreshold: 95,
            }}
          />
        )}
        {messages.loadingNext && <ActivityIndicator />}
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
        count={conversation.unreadCount}
        time="now"
        visible={unreadBannerVisible}
        onPress={onUnreadBannerPress}
        onClosePress={onCloseUnreadBannerPress}
      />
      {renderChatMessages()}
      <ChatInput
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
