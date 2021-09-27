import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {debounce, isEmpty} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import {MessageOptionType} from '~/constants/chat';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/interfaces/IChat';
import {RootStackParamList} from '~/interfaces/IRouter';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {showAlertNewFeature, showHideToastMessage} from '~/store/modal/actions';
import dimension from '~/theme/dimension';
import {getDefaultAvatar} from '../helper';
import {
  ChatInput,
  ListMessages,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';
import DownButton from './fragments/DownButton';
import GroupChatWelcome from './fragments/GroupChatWelcome';
import UnreadBanner from './fragments/UnreadBanner';

const Conversation = () => {
  const {user} = useAuth();
  const {conversation, messages} = useChat();
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
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
  const [error, setError] = useState<string | null>(null);
  const [downButtonVisible, setDownButtonVisible] = useState<boolean>(false);
  const [unreadBannerVisible, setUnreadBannerVisible] =
    useState<boolean>(false);
  const listRef = useRef<FlatList>(null);
  let initiated = false;
  let countRetryScrollToBottom = useRef(0).current;

  const onLoadAvatarError = () => {
    setAvatar(getDefaultAvatar(conversation?.name));
  };

  useEffect(() => {
    !isFocused && dispatch(actions.readSubcriptions(conversation._id));
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
    }
  }, [route.params?.roomId]);

  useEffect(() => {
    if (conversation?._id) {
      _getMessages();
      setUnreadBannerVisible(
        conversation.unreadCount > appConfig.unreadMessageOffset,
      );
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

  const scrollToUnreadMessage = (initRenderItems: number) => {
    if (
      initRenderItems < 4 &&
      countRetryScrollToBottom < 20 &&
      !initiated &&
      conversation.unreadCount > appConfig.unreadMessageOffset
    ) {
      initiated = true;
      countRetryScrollToBottom = countRetryScrollToBottom + 1;
      try {
        listRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
        setDownButtonVisible(true);
        const _offset =
          conversation.unreadCount -
          (appConfig.messagesPerPage + appConfig.unreadMessageOffset);
        dispatch(
          actions.getMoreDownMessages({
            offset: _offset > 0 ? _offset : 0,
            count:
              conversation.unreadCount - appConfig.unreadMessageOffset >=
              appConfig.messagesPerPage
                ? appConfig.messagesPerPage
                : conversation.unreadCount - appConfig.unreadMessageOffset,
          }),
        );
      } catch (e: any) {
        console.log('scroll error', e);
        //sometime it's not trigger scrollToIndexFailed
      }
    }
  };

  const _getMessages = () => {
    dispatch(actions.resetData('messages'));
    dispatch(
      actions.getData('messages', {
        roomId: conversation._id,
        type: conversation.type,
        count: appConfig.messagesPerPage,
        offset:
          conversation.unreadCount > appConfig.unreadMessageOffset
            ? conversation.unreadCount - appConfig.unreadMessageOffset
            : 0,
      }),
    );
  };

  const loadMoreMessages = () => {
    dispatch(actions.mergeExtraData('messages'));
  };

  const onOptionsClosed = () => {
    setSelectedMessage(undefined);
  };

  const onReactionPress = async (type: string) => {
    dispatch(actions.reactMessage(selectedMessage, type));

    messageOptionsModalRef.current?.close();
  };

  const deleteMessage = () => {
    selectedMessage && dispatch(actions.deleteMessage(selectedMessage));
    setSelectedMessage(undefined);
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

  const onMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent?.contentOffset.y;
    // 2 screens
    setDownButtonVisible(
      messages.unreadPoint > appConfig.unreadMessageOffset ||
        offsetY >= dimension.deviceHeight * 2,
    );
    if (
      conversation.unreadCount > appConfig.unreadMessageOffset &&
      !messages.loadingDown &&
      offsetY < 10
    ) {
      // reach bottom
      if (
        messages.unreadPoint !==
        conversation.unreadCount - appConfig.unreadMessageOffset
      ) {
        dispatch(
          actions.getMoreDownMessages({
            offset: messages.downOffset < 0 ? 0 : messages.downOffset,
            count:
              messages.downOffset < 0
                ? messages.downOffset + appConfig.messagesPerPage
                : appConfig.messagesPerPage,
          }),
        );
      } else {
        setUnreadBannerVisible(false);
        setDownButtonVisible(false);
        dispatch(actions.readConversation());
      }
    }
  };

  const onDownPress = () => {
    if (conversation.unreadCount - messages.unreadPoint > 50) {
      _getMessages();
    } else {
      listRef.current?.scrollToOffset({offset: 0, animated: true});
    }
    dispatch(actions.readConversation());
    setUnreadBannerVisible(false);
    setDownButtonVisible(false);
  };

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const props = {
      previousMessage:
        index < messages.data.length - 1 && messages.data[index + 1],
      currentMessage: item,
      index: index,
      onReactPress: () => onMenuPress('reactions'),
      onReplyPress: () => onMenuPress('reply'),
      onLongPress,
    };
    return <MessageContainer {...props} />;
  };

  const onViewableItemsChanged = useRef(({changed}: {changed: any[]}) => {
    if (
      conversation.unreadCount > appConfig.unreadMessageOffset &&
      changed &&
      changed.length > 0
    ) {
      scrollToUnreadMessage(changed[0].index + 1);
    }
  });

  const onUnreadBannerPress = () => {
    try {
      listRef.current?.scrollToIndex({
        index: messages.unreadPoint,
        animated: true,
      });
    } catch (e: any) {
      scrollToIndexFailed();
    }
  };

  const onCloseUnreadBannerPress = () => {
    setUnreadBannerVisible(false);
  };

  const scrollToIndexFailed = () => {
    setTimeout(scrollToUnreadMessage, 200);
  };

  const renderChatMessages = () => {
    if (!messages.loading && isEmpty(messages.data))
      return <GroupChatWelcome />;

    return (
      <ListMessages
        listRef={listRef}
        nativeID={'list-messages'}
        inverted
        data={messages.data}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={Platform.OS === 'web' ? 0 : 0.5}
        removeClippedSubviews={true}
        onScrollToIndexFailed={scrollToIndexFailed}
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={appConfig.messagesPerPage}
        initialNumToRender={appConfig.messagesPerPage}
        /* means that the component will render the visible screen
        area plus (up to) 4999 screens above and 4999 below the viewport.*/
        windowSize={5000}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onViewableItemsChanged={onViewableItemsChanged.current}
        ListFooterComponent={() => (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
        maintainVisibleContentPosition={
          conversation.unreadCount > appConfig.unreadMessageOffset
            ? {
                minIndexForVisible: 0,
              }
            : null
        }
        onMomentumScrollEnd={onMomentumScrollEnd}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
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
      <ChatInput onError={setError} />
      <MessageOptionsModal
        isMyMessage={selectedMessage?.user?.username === user?.username}
        ref={messageOptionsModalRef}
        onMenuPress={onMenuPress}
        onReactionPress={onReactionPress}
        onClosed={onOptionsClosed}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.large,
    },
    headerTitle: {
      marginEnd: spacing.margin.small,
    },
  });
};

export default React.memo(Conversation);
