import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import appConfig from '~/configs/appConfig';
import {useBaseHook} from '~/hooks';
import useChat from '~/hooks/chat';
import useModal from '~/hooks/modal';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {IConversation} from '~/interfaces/IChat';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {ITabTypes} from '~/interfaces/IRouter';
import {useKeySelector} from '~/hooks/selector';
import {appScreens} from '~/configs/navigator';

const ConversationsList = (): React.ReactElement => {
  const listRef = useRef<any>();

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

  const rootScreenName = useKeySelector('app.rootScreenName');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    /**
     * Get 'chat' in init url
     * to handle user access the deeper level
     * in account setting by url
     */
    if (Platform.OS === 'web') {
      console.log('DEBUG');
      const initUrl = window.location.href;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parse = require('url-parse');
      const url = parse(initUrl, true);
      const paths = url.pathname.split('/');
      console.log(`paths`, paths);

      if (!paths || paths.length === 0) return;

      /**
       * set new currentPath directly, not through dispatch as
       * there is errors, when access through url
       */
      setCurrentPath(paths[2]);
      // const newRootScreenName = `${paths[1]}/${paths[2]}}`;
      // dispatch(appActions.setRootScreenName(newRootScreenName));
    }
  }, []);

  useEffect(() => {
    const paths = rootScreenName.split('/');
    if (!paths || paths.length === 0 || paths[0] !== appScreens.chat) return;

    const roomId = paths[1];

    if (!roomId) return;

    setCurrentPath(paths[1]);
  }, [rootScreenName]);

  useEffect(() => {
    isFocused && dispatch(actions.getSubscriptions());
  }, [isFocused]);

  useEffect(() => {
    Platform.OS === 'web' && inputRef.current?.focus();
  }, [searchInputFocus]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'chat') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const loadMore = () => {
    dispatch(actions.mergeExtraData('rooms'));
  };

  const onChatPress = (item: IConversation) => {
    dispatch(actions.setConversationDetail(item));
    rootNavigation.navigate(chatStack.conversation, {
      roomId: item._id,
      message_id: undefined,
    });
  };

  const onMenuPress = async () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.createConversation);
  };

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
    <ScreenWrapper testID="ChatScreen" isFullView>
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
        listRef={listRef}
        type="conversation"
        isFullView
        loading={loading}
        data={searchQuery ? searchResult : data}
        onItemPress={onChatPress}
        onRefresh={() => dispatch(actions.getSubscriptions())}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showItemSeparator={false}
        containerStyle={styles.listContainer}
        currentPath={currentPath}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    inputSearch: {
      margin: spacing.margin.base,
    },
    listContainer: {
      marginHorizontal: Platform.OS === 'web' ? spacing.margin.small : 0,
    },
  });
};

export default ConversationsList;
