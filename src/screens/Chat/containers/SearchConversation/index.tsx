import i18next from 'i18next';
import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Icon from '~/beinComponents/Icon';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import NoSearchResult from '~/beinFragments/NoSearchResult';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';
import {debounce} from 'lodash';
import appConfig from '~/configs/appConfig';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';

const SearchConversation = () => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const dispatch = useDispatch();
  const search = useKeySelector('chat.search');

  useEffect(() => {
    doSearch('');
  }, []);

  const doSearch = (text: string) => {
    dispatch(actions.resetData('search'));
    dispatch(
      actions.getData(
        'search',
        {
          name: text,
        },
        'data',
      ),
    );
  };

  const searchHandler = useCallback(
    debounce(doSearch, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    searchHandler(text);
  };

  const onBackPress = () => {
    rootNavigation.goBack();
  };

  const goConversation = (item: any) => {
    if (item.type === 'user') {
      //@ts-ignore
      dispatch(actions.createConversation([{username: item.username}], true));
    } else {
      dispatch(actions.setConversationDetail(item));
      rootNavigation.navigate(chatStack.conversation, {roomId: item._id});
    }
  };

  const renderItem = ({item}: {item: any; index: number}) => {
    const subTitle =
      item.type === 'user'
        ? `${item.title_position}${i18next.t(
            'chat:search_result:title_position',
          )}${item.company}`
        : item.description ||
          `${item.members?.join(' ,')}${i18next
            .t('chat:search_result:member_count')
            .replace('{0}', `${item.usersCount - item.members?.length}`)}`;
    return (
      <PrimaryItem
        title={item.name}
        subTitle={subTitle}
        subTitleProps={{color: theme.colors.textSecondary}}
        LeftComponent={
          <Avatar.Large
            style={styles.marginRight}
            source={item.avatar}
            placeholderSource={images.img_user_avatar_default}
          />
        }
        onPress={() => goConversation(item)}
      />
    );
  };

  const EmptyComponent = () => {
    if (search.loading) return null;
    return <NoSearchResult />;
  };

  return (
    <ScreenWrapper
      testID="SearchChatScreen"
      isFullView
      style={styles.container}>
      <View style={styles.header}>
        <Icon
          icon="iconBack"
          size={28}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={onBackPress}
        />
        <SearchInput
          style={styles.inputSearch}
          autoFocus={false}
          placeholder={i18next.t('chat:placeholder_search')}
          onChangeText={onQueryChanged}
        />
      </View>
      <ListView
        isFullView
        style={styles.list}
        data={search.data}
        loading={search.loading}
        ListEmptyComponent={EmptyComponent}
        renderItem={renderItem}
      />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme, insets: EdgeInsets) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: colors.borderDivider,
      borderBottomWidth: 1,
      padding: spacing.padding.base,
    },
    inputSearch: {
      flex: 1,
      marginStart: spacing.padding.small,
    },
    marginRight: {
      marginRight: spacing?.margin.base,
    },
    list: {
      marginTop: spacing.padding.base,
    },
  });
};

export default SearchConversation;
