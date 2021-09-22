import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import {useBaseHook} from '~/hooks';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IConversation} from '~/interfaces/IChat';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {deviceDimensions, scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import appConfig from '~/configs/appConfig';
import {createRef} from 'react';
import useModal from '~/hooks/modal';
import Divider from '~/beinComponents/Divider';
import NoSearchResult from '~/beinFragments/NoSearchResult';

const ConversationsList = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const inputRef = createRef<TextInput>();

  const {conversations} = useChat();
  const {searchInputFocus} = useModal();
  const {data, searchResult, loading} = conversations;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    isFocused && dispatch(actions.getSubscriptions());
  }, [isFocused]);

  useEffect(() => {
    Platform.OS === 'web' && inputRef.current?.focus();
  }, [searchInputFocus]);

  const loadMore = () => {
    dispatch(actions.mergeExtraData('rooms'));
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.setConversationDetail(item));
    dispatch(actions.readSubcriptions(item._id));
    rootNavigation.navigate(chatStack.conversation, {roomId: item._id});
  };

  const onMenuPress = async () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.createConversation);
  };

  const renderItemSeparator = () => <Divider style={styles.itemSeparator} />;

  const renderEmpty = () => {
    if (!searchQuery) return null;
    return <NoSearchResult />;
  };

  const doSearch = (searchQuery: string) => {
    dispatch(actions.resetData('members'));
    dispatch(actions.searchConversation(searchQuery));
  };

  const searchHandler = useCallback(
    debounce(doSearch, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    searchHandler(text);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <Header
        title="chat:title"
        titleTextProps={{useI18n: true}}
        hideBack
        menuIcon="iconCreateChat"
        onPressMenu={onMenuPress}
        removeBorderAndShadow={isLaptop}
      />
      <SearchInput
        inputRef={inputRef}
        style={styles.inputSearch}
        autoFocus={false}
        placeholder={t('chat:placeholder_search')}
        onChangeText={onQueryChanged}
      />
      <ListView
        type="conversation"
        isFullView
        loading={loading}
        data={searchQuery ? searchResult : data}
        onItemPress={onChatPress}
        renderItemSeparator={renderItemSeparator}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme) => {
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
    itemSeparator: {
      marginLeft: 72,
      marginRight: spacing.margin.large,
    },
  });
};

export default ConversationsList;
