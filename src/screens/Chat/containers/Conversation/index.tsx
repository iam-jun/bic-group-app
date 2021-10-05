import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import i18next from 'i18next';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import apiConfig from '~/configs/apiConfig';
import appConfig from '~/configs/appConfig';
import {MessageOptionType} from '~/constants/chat';
import {ReactionType} from '~/constants/reactions';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {IMessage, IQuotedMessage} from '~/interfaces/IChat';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {IReactionCounts} from '~/interfaces/IPost';
import {RootStackParamList} from '~/interfaces/IRouter';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {
  ChatInput,
  ChatWelcome,
  DownButton,
  ListMessages,
  MessageContainer,
  MessageOptionsModal,
  UnreadBanner,
} from '~/screens/Chat/components';
import actions from '~/screens/Chat/redux/actions';
import {makeHttpRequest} from '~/services/httpApiRequest';
import * as modalActions from '~/store/modal/actions';
import {showAlertNewFeature, showHideToastMessage} from '~/store/modal/actions';
import dimension from '~/theme/dimension';
import LoadingMessages from '../../components/LoadingMessages';
import {getDefaultAvatar} from '../../helper';

const Conversation = () => {
  const {user} = useAuth();
  const {conversation, messages, unreadMessagePosition} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [replyingMessage, setReplyingMessage] = useState<IMessage>();
  const messageOptionsModalRef = React.useRef<any>();
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Conversation'>>();
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(
    conversation.avatar,
  );
  const isFocused = useIsFocused();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downButtonVisible, setDownButtonVisible] = useState<boolean>(false);
  const [unreadBannerVisible, setUnreadBannerVisible] =
    useState<boolean>(false);
  const listRef = useRef<FlatList>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage>();

  const onLoadAvatarError = () => {
    setAvatar(getDefaultAvatar(conversation?.name));
  };

  useEffect(() => {
    if (!isFocused) {
      dispatch(actions.readSubscriptions(conversation._id));
      dispatch(actions.resetData('messages'));
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
    }
  }, [route.params?.roomId]);

  useEffect(() => {
    if (conversation?._id) {
      getMessages(conversation.unreadCount);
      setUnreadBannerVisible(conversation.unreadCount > 0);
      setDownButtonVisible(
        conversation.unreadCount > appConfig.messagesPerPage,
      );
      setAvatar(conversation?.avatar);
    }
  }, [conversation?._id]);

  useEffect(() => {
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
  }, [error]);

  const getMessages = (unreadCount: number) => {
    dispatch(actions.resetData('messages'));
    if (unreadCount > appConfig.messagesPerPage) {
      dispatch(actions.getUnreadMessage());
    } else {
      dispatch(actions.getMessagesHistory());
    }
  };

  const loadMoreMessages = () => {
    if (!messages.loading) dispatch(actions.mergeMessagesHistory());
  };

  const onOptionsClosed = () => {
    setSelectedMessage(undefined);
  };

  const onAddReaction = (reactionId: ReactionType, messageId: string) => {
    dispatch(
      actions.reactMessage({
        emoji: reactionId,
        messageId,
        shouldReact: true,
      }),
    );
  };

  const onRemoveReaction = (reactionId: ReactionType, messageId: string) => {
    dispatch(
      actions.reactMessage({
        emoji: reactionId,
        messageId,
        shouldReact: false,
      }),
    );
  };

  const onPressReact = (
    event: any,
    item: IMessage,
    side: 'left' | 'right' | 'center',
  ) => {
    dispatch(
      modalActions.setShowReactionBottomSheet({
        show: true,
        position: {x: event?.pageX, y: event?.pageY},
        side: side,
        callback: (reactionId: ReactionType) =>
          onAddReaction(reactionId, item._id),
      }),
    );
  };

  const onReactionPress = async (type: string) => {
    if (!!selectedMessage) {
      if (type === 'add_react') {
        onPressReact(null, selectedMessage, 'left');
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
  };

  const deleteMessage = () => {
    selectedMessage && dispatch(actions.deleteMessage(selectedMessage));
    setSelectedMessage(undefined);
  };

  const editMessage = () => {
    selectedMessage && setEditingMessage(selectedMessage);
  };

  const onEditMessage = (message: IMessage | undefined) => {
    setEditingMessage(message);
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

  const jumpToRepliedMessage = (message?: IQuotedMessage) => {
    if (!message) return;

    const index = messages.data.findIndex(
      (item: IMessage) => item._id === message.msgId,
    );
    if (index >= 0) {
      listRef.current?.scrollToIndex({index, animated: true});
    } else {
      // dispatch(actions.resetData('messages'));
      dispatch(actions.getSurroundingMessages(message.msgId));
    }
  };

  const onPressBack = async () => {
    if (route.params?.initial === false)
      rootNavigation.replace(chatStack.conversationList);
    else rootNavigation.goBack();
  };

  const onMenuPress = async (menu: MessageOptionType) => {
    switch (menu) {
      case 'delete':
        deleteMessage();
        break;
      case 'reply':
        setReplyingMessage(selectedMessage);
        break;
      case 'edit':
        editMessage();
        break;
      case 'reactions':
        viewReactions();
        break;
      default:
        dispatch(showAlertNewFeature());
        break;
    }
    messageOptionsModalRef.current?.close();
  };

  const onSearchPress = async () => {
    alert('Searching is in development');
  };

  const goConversationDetail = () => {
    rootNavigation.navigate(chatStack.conversationDetail, {
      roomId: conversation._id,
    });
  };

  const onLongPress = (item: IMessage, position: {x: number; y: number}) => {
    setSelectedMessage(item);
    messageOptionsModalRef.current?.open(position.x, position.y);
  };

  const getReactionStatistics = async (param: {
    reactionType: ReactionType;
    messageId: string;
  }) => {
    try {
      const {reactionType, messageId} = param || {};
      const response: any = await makeHttpRequest(
        apiConfig.Chat.getReactionStatistics({
          message_id: messageId,
          reaction_name: reactionType,
        }),
      );
      const data = response?.data?.data;
      const users = data.map((item: {username: string; fullname: string}) => ({
        avatar: getDefaultAvatar(item.username),
        username: item.username,
        fullname: item.fullname,
      }));

      return Promise.resolve(users || []);
    } catch (err) {
      return Promise.reject();
    }
  };

  const onLongPressReaction = (
    messageId: string,
    reactionType: ReactionType,
    reactionCounts?: IReactionCounts,
  ) => {
    if (reactionCounts) {
      const payload: IPayloadReactionDetailBottomSheet = {
        isOpen: true,
        reactionCounts: reactionCounts,
        initReaction: reactionType,
        getDataParam: {messageId},
        getDataPromise: getReactionStatistics,
      };
      dispatch(modalActions.showReactionDetailBottomSheet(payload));
    }
  };

  const onCancelEdit = () => setEditingMessage(undefined);

  const renderEditingMessage = () => {
    if (!editingMessage) return null;

    return (
      <View style={styles.editMessageHeader}>
        <View style={styles.headerContent}>
          <Text.BodySM color={theme.colors.primary6}>
            {i18next.t('chat:text_editing_message')}
            <Text.BodySM color={theme.colors.textSecondary}>
              {'  • '}
              <Text.BodySM
                useI18n
                color={theme.colors.textSecondary}
                onPress={onCancelEdit}>
                common:btn_cancel
              </Text.BodySM>
            </Text.BodySM>
          </Text.BodySM>
        </View>
      </View>
    );
  };

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const props = {
      previousMessage: index > 0 && messages.data[index - 1],
      currentMessage: item,
      index: index,
      onReactPress: (event: any, side: 'left' | 'right' | 'center') =>
        onPressReact(event, item, side),
      onReplyPress: () => setReplyingMessage(item),
      onLongPress,
      onAddReaction: (reactionId: ReactionType) =>
        onAddReaction(reactionId, item._id),
      onRemoveReaction: (reactionId: ReactionType) =>
        onRemoveReaction(reactionId, item._id),
      onLongPressReaction: (reactionType: ReactionType) =>
        onLongPressReaction(item._id, reactionType, item?.reaction_counts),
      onQuotedMessagePress: () => jumpToRepliedMessage(item.quotedMessage),
    };
    return <MessageContainer {...props} />;
  };

  const onViewableItemsChanged = (changed: any[]) => {
    if (
      Platform.OS !== 'web' &&
      conversation.unreadCount < appConfig.messagesPerPage &&
      messages.unreadMessage &&
      changed &&
      changed.length > 0
    ) {
      const item = changed[0].item;

      if (item._id !== messages.unreadMessage?._id) {
        listRef.current?.scrollToIndex({
          index: unreadMessagePosition,
          animated: false,
        });
      }
    }
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

  const scrollToBottom = () => {
    if (messages.canLoadNext) setDownButtonVisible(true);
    if (
      !isScrolled &&
      !isEmpty(messages.data) &&
      conversation.unreadCount === 0
    ) {
      setIsScrolled(true);
      listRef.current?.scrollToIndex({
        index: messages.data.length - 1,
        animated: false,
      });
    }
  };

  const onMomentumScrollEnd = (event: any) => {
    if (Platform.OS === 'web') return;

    const offsetY = event.nativeEvent?.contentOffset.y;
    const contentHeight = event.nativeEvent?.contentSize.height;

    // 2 screens
    setDownButtonVisible(
      contentHeight - dimension.deviceHeight * 2 > offsetY ||
        messages.unreadPoint > appConfig.unreadMessageOffset,
    );

    if (!messages.loadingNext && offsetY < 10) {
      // reach top
      loadMoreMessages();
    }
  };

  const onEndReached = () => {
    if (messages.canLoadNext) {
      dispatch(actions.getNextMessages());
    } else {
      if (conversation.unreadCount > 0) {
        setUnreadBannerVisible(false);
        dispatch(actions.readConversation());
      }
    }
  };

  const onDownPress = () => {
    setDownButtonVisible(false);
    if (messages.canLoadNext) {
      setUnreadBannerVisible(false);
      setIsScrolled(false);
      dispatch(actions.readConversation());
      getMessages(0);
    } else {
      listRef.current?.scrollToIndex({
        index: messages.data.length - 1,
        animated: true,
      });
    }
  };

  const renderChatMessages = () => {
    if (messages.loading) return <LoadingMessages />;

    if (isEmpty(messages.data)) return <ChatWelcome type={conversation.type} />;

    return (
      <View style={styles.listContainer}>
        <ListMessages
          listRef={listRef}
          nativeID={'list-messages'}
          // inverted
          data={messages.data}
          keyboardShouldPersistTaps="handled"
          onEndReached={onEndReached}
          onEndReachedThreshold={Platform.OS === 'web' ? 0 : 0.5}
          removeClippedSubviews={true}
          onScrollToIndexFailed={scrollToIndexFailed}
          onContentSizeChange={scrollToBottom}
          showsHorizontalScrollIndicator={false}
          maxToRenderPerBatch={appConfig.messagesPerPage}
          initialNumToRender={appConfig.messagesPerPage}
          contentContainerStyle={{
            paddingBottom: 8,
            flexGrow: 1,
            justifyContent: 'flex-end',
            // alignContent: 'flex-end',
            // alignContent: 'baseline',
            // flexDirection: 'column-reverse',
            // alignItems: 'flex-end',
          }}
          /* means that the component will render the visible screen
        area plus (up to) 4999 screens above and 4999 below the viewport.*/
          windowSize={5000}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          onViewableItemsChanged={(changed: any) =>
            onViewableItemsChanged(changed)
          }
          ListFooterComponent={() => (
            <ViewSpacing height={theme.spacing.margin.large} />
          )}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          onMomentumScrollEnd={onMomentumScrollEnd}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />
      </View>
    );
  };

  return (
    <ScreenWrapper isFullView testID="MessageScreen">
      <Header
        avatar={_avatar}
        avatarProps={{variant: 'default', onError: onLoadAvatarError}}
        title={conversation.name}
        titleTextProps={{numberOfLines: 1, style: styles.headerTitle}}
        icon="search"
        onPressIcon={onSearchPress}
        menuIcon="ConversationInfo"
        onPressMenu={goConversationDetail}
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
      <DownButton visible={downButtonVisible} onDownPress={onDownPress} />
      {renderEditingMessage()}
      <ChatInput
        editingMessage={editingMessage}
        onChangeMessage={onEditMessage}
        replyingMessage={replyingMessage}
        onCancelReplying={() => setReplyingMessage(undefined)}
        onError={setError}
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

const createStyles = (theme: IObject<any>) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.large,
    },
    listContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    headerTitle: {
      marginEnd: spacing.margin.small,
    },
    editMessageHeader: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.base,
      borderTopWidth: 1,
      borderTopColor: colors.borderDivider,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default React.memo(Conversation);
