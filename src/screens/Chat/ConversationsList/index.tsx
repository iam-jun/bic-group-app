import {useIsFocused} from '@react-navigation/native';
import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
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
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import appConfig from '~/configs/appConfig';
import Divider from '~/beinComponents/Divider';

const ConversationsList = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {conversations} = useChat();
  const {data, searchResult, loading} = conversations;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    isFocused && dispatch(actions.getSubscriptions());
  }, [isFocused]);

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
    return (
      <View style={styles.emptyView}>
        <Image source={images.img_search_empty} style={styles.imageNoResults} />
        <Text.Body
          color={theme.colors.textSecondary}
          useI18n
          style={styles.textEmpty}>
          common:text_search_no_results
        </Text.Body>
      </View>
    );
  };

  const doSearch = (searchQuery: string) => {
    dispatch(actions.resetData('members'));
    dispatch(actions.searchConversation(searchQuery));
  };

  const seachHandler = useCallback(
    debounce(doSearch, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    seachHandler(text);
  };

  return (
    <ScreenWrapper style={styles.container} testID="ChatScreen" isFullView>
      <Header
        title={i18next.t('chat:title')}
        hideBack
        avatar={images.img_menu_chat}
        menuIcon="iconCreateChat"
        onPressMenu={onMenuPress}
      />
      <SearchInput
        style={styles.inputSearch}
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
      marginBottom: spacing.margin.small,
    },
    emptyView: {
      alignItems: 'center',
      marginVertical: spacing.margin.base,
    },
    imageNoResults: {
      width: scaleSize(200),
      height: scaleSize(220),
    },
    textEmpty: {
      textAlign: 'center',
      width: 241,
    },
  });
};

export default ConversationsList;
