import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  InteractionManager,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import {appScreens} from '~/configs/navigator';
import {useBaseHook} from '~/hooks';
import useModal from '~/hooks/modal';
import {useRootNavigation, useTabPressListener} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IConversation} from '~/interfaces/IChat';
import {ITabTypes} from '~/interfaces/IRouter';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '~/screens/Chat/redux/actions';
import {getConversations} from '~/selectors/chat';
import modalActions from '~/store/modal/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {ConversationItemMenu} from '../../components';

const _ConversationsList = (): React.ReactElement => {
  const listRef = useRef<any>();

  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation, leftNavigation} = useRootNavigation();

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const loading = useKeySelector('chat.rooms.loading');
  const conversations = useSelector(state => getConversations(state));

  const {searchInputFocus} = useModal();

  const rootScreenName = useKeySelector('app.rootScreenName');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      isFocused && dispatch(actions.getSubscriptions());

      /**
       * Get 'chat' in init url
       * to handle user access the deeper level
       * in account setting by url
       */
      if (Platform.OS === 'web') {
        const initUrl = window.location.href;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const parse = require('url-parse');
        const url = parse(initUrl, true);
        const paths = url.pathname.split('/');

        if (!paths || paths.length === 0) return;

        /**
         * set new currentPath directly, not through dispatch as
         * there is errors, when access through url
         */
        setCurrentPath(paths[2]);
        // const newRootScreenName = `${paths[1]}/${paths[2]}}`;
        // dispatch(appActions.setRootScreenName(newRootScreenName));
      }
    });
  }, [isFocused]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const paths = rootScreenName.split('/');
      if (!paths || paths.length === 0 || paths[0] !== appScreens.chat) return;

      const roomId = paths[1];

      if (!roomId) return;

      setCurrentPath(paths[1]);
    });
  }, [rootScreenName]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      Platform.OS === 'web' && searchInputFocus && goSearch();
    });
  }, [searchInputFocus]);

  useTabPressListener(
    (tabName: ITabTypes) => {
      if (tabName === 'chat') {
        listRef?.current?.scrollToOffset?.({animated: true, offset: 0});
      }
    },
    [listRef],
  );

  const onChatPress = (item: IConversation) => {
    rootNavigation.navigate(chatStack.conversation, {
      roomId: item._id,
      message_id: undefined,
    });
    if (Platform.OS === 'web') setCurrentPath(item._id);
  };

  const onChatLongPress = useCallback((item: IConversation) => {
    if (Platform.OS === 'web') return;

    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <ConversationItemMenu
            conversationId={item._id}
            disableNotifications={item.disableNotifications}
          />
        ),
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
        },
      }),
    );
  }, []);

  const onMenuPress = useCallback(() => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.createConversation);
  }, []);

  const renderEmpty = () => {
    return <NoSearchResult />;
  };

  const goSearch = useCallback(() => {
    if (Platform.OS === 'web')
      leftNavigation.navigate(chatStack.searchConversations);
    else rootNavigation.navigate(chatStack.searchConversations);
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(actions.getSubscriptions());
  }, []);

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
      <Pressable onPress={goSearch}>
        <View pointerEvents="none">
          <SearchInput
            style={styles.inputSearch}
            autoFocus={false}
            placeholder={t('chat:placeholder_search')}
          />
        </View>
      </Pressable>

      <ListView
        listRef={listRef}
        type="conversation"
        isFullView
        loading={loading}
        data={conversations}
        onEndReachedThreshold={0.5}
        showItemSeparator={false}
        containerStyle={styles.listContainer}
        currentPath={currentPath}
        onItemPress={onChatPress}
        onItemLongPress={onChatLongPress}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
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

const ConversationsList = React.memo(_ConversationsList);
ConversationsList.whyDidYouRender = true;
export default ConversationsList;
