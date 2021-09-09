import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import {MessageOptionType, roomTypes} from '~/constants/chat';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/interfaces/IChat';
import {RootStackParamList} from '~/interfaces/IRouter';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {showAlertNewFeature, showHideToastMessage} from '~/store/modal/actions';
import {deviceDimensions} from '~/theme/dimension';
import {getAvatar, getDefaultAvatar} from '../helper';
import {
  ChatInput,
  ListMessages,
  MessageContainer,
  MessageOptionsModal,
} from './fragments';
import GroupChatWelcome from './fragments/GroupChatWelcome';

const Conversation = () => {
  const {user} = useAuth();
  const {conversation, messages} = useChat();
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
  const [error, setError] = useState<string | null>(null);
  const isDirect = conversation.type === roomTypes.DIRECT;

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const onLoadAvatarError = () => {
    if (isDirect) setAvatar(images.img_user_avatar_default);
    else {
      const {usernames} = conversation;
      if (usernames)
        setAvatar(usernames.map((username: string) => getAvatar(username)));
      else setAvatar(getDefaultAvatar(conversation?.name));
    }
  };

  useEffect(() => {
    !isFocused && dispatch(actions.readSubcriptions(conversation._id));
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.roomId) {
      dispatch(actions.getConversationDetail(route.params.roomId));
      _getMessages();
    }
  }, [route.params]);

  useEffect(() => {
    conversation._id && _getMessages();
  }, [conversation._id]);

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
    rootNavigation.navigate(chatStack.conversationDetail);
  };

  const onLongPress = (item: IMessage, position: {x: number; y: number}) => {
    setSelectedMessage(item);
    messageOptionsModalRef.current?.open(position.x, position.y);
  };

  const onScroll = (event: any) => {
    const element = event.target;

    if (element.scrollTop <= 100) {
      loadMoreMessages();
    }
  };

  const renderItem = ({item, index}: {item: IMessage; index: number}) => {
    const props = {
      previousMessage:
        index < messages.data.length - 1 && messages.data[index + 1],
      currentMessage: item,
      onReactPress: () => onMenuPress('reactions'),
      onReplyPress: () => onMenuPress('reply'),
      onLongPress,
    };
    return <MessageContainer {...props} />;
  };
  const renderChatMessages = () => {
    if (!messages.loading && isEmpty(messages.data))
      return <GroupChatWelcome />;

    return (
      <ListMessages
        inverted={Platform.OS !== 'web'}
        data={messages.data}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
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
        onScroll={onScroll}
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
        hideBack={isLaptop}
      />
      {renderChatMessages()}

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

export default Conversation;
