import {useIsFocused} from '@react-navigation/native';
import i18next from 'i18next';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Divider from '~/components/Divider';
import {useBaseHook} from '~/hooks';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {IConversation} from '~/interfaces/IChat';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';

const ConversationsList = (): React.ReactElement => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {conversations} = useChat();
  const {data, loading} = conversations;

  useEffect(() => {
    isFocused && dispatch(actions.getSubscriptions());
  }, [isFocused]);

  useEffect(() => {
    // dispatch(actions.getSubscriptions());
    _getConversations();
  }, []);

  const _getConversations = () => {
    dispatch(actions.resetData('groups'));
    dispatch(actions.getData('groups', {sort: {_updatedAt: -1}}));
  };

  const loadMore = () => {
    dispatch(actions.mergeExtraData('groups'));
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.selectConversation(item));
    dispatch(actions.readSubcriptions(item._id));
    rootNavigation.navigate(chatStack.conversation, {roomId: item._id});
  };

  const onMenuPress = async () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.createConversation);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <Header
        title={i18next.t('chat:title')}
        hideBack
        menuIcon="iconCreateChat"
        onPressMenu={onMenuPress}
      />
      <SearchInput
        style={styles.inputSearch}
        placeholder={t('chat:placeholder_search')}
      />
      <ListView
        type="conversation"
        isFullView
        loading={loading}
        data={data}
        onItemPress={onChatPress}
        renderItemSeparator={() => <Divider />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    inputSearch: {
      margin: spacing.margin.base,
    },

    item: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default ConversationsList;
