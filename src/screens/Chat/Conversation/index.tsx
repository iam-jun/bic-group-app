import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

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
import {getDefaultAvatar} from '../helper';
import {
  ChatInput,
  ListMessages,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';
import DownButton from './fragments/DownButton';
import ChatWelcome from './fragments/ChatWelcome';
import * as modalActions from '~/store/modal/actions';
import {ReactionType} from '~/constants/reactions';
import Text from '~/beinComponents/Text';

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
  const listRef = useRef<FlatList>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage>();

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
    minimumViewTime: 5,
  });

  const onLoadAvatarError = () => {
    setAvatar(getDefaultAvatar(conversation?.name));
  };

  useEffect(() => {
    !isFocused && dispatch(actions.readSubscriptions(conversation._id));
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
    }
  }, [route.params?.roomId]);

  useEffect(() => {
    if (conversation?._id) {
      setAvatar(conversation?.avatar);
      _getMessages();
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

  const _getMessages = () => {
    dispatch(actions.resetData('messages'));
    dispatch(
      actions.getData('messages', {
        roomId: conversation._id,
        type: conversation.type,
      }),
    );
  };

  const loadMoreMessages = () => {
    dispatch(actions.mergeExtraData('messages'));
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
      case 'edit':
        editMessage();
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

  const onViewableItemsChanged = React.useRef(({changed}: {changed: any[]}) => {
    if (changed && changed.length > 0) {
      setDownButtonVisible(changed[0].index > 20);
    }
  });
  const onDownPress = () => {
    listRef.current?.scrollToOffset({offset: 0, animated: true});
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
      previousMessage:
        index < messages.data.length - 1 && messages.data[index + 1],
      currentMessage: item,
      onReactPress: (event: any, side: 'left' | 'right' | 'center') =>
        onPressReact(event, item, side),
      onReplyPress: () => onMenuPress('reply'),
      onLongPress,
      onAddReaction: (reactionId: ReactionType) =>
        onAddReaction(reactionId, item._id),
      onRemoveReaction: (reactionId: ReactionType) =>
        onRemoveReaction(reactionId, item._id),
    };
    return <MessageContainer {...props} />;
  };

  const renderChatMessages = () => {
    if (!messages.loading && isEmpty(messages.data))
      return <ChatWelcome type={conversation.type} />;

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
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={appConfig.recordsPerPage}
        initialNumToRender={appConfig.recordsPerPage}
        /* means that the component will render the visible screen
        area plus (up to) 4999 screens above and 4999 below the viewport.*/
        windowSize={5000}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListFooterComponent={() => (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
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
      {renderChatMessages()}
      <DownButton visible={downButtonVisible} onDownPress={onDownPress} />
      {renderEditingMessage()}
      <ChatInput
        editingMessage={editingMessage}
        onChangeMessage={onEditMessage}
        onError={setError}
      />
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
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.large,
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
