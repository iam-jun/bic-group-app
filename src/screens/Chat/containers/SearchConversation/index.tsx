import i18next from 'i18next';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Icon from '~/beinComponents/Icon';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import ListView from '~/beinComponents/list/ListView';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import {IConversation} from '~/interfaces/IChat';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';

const SearchConversation = () => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const dispatch = useDispatch();
  const search = useKeySelector('chat.search');

  useEffect(() => {
    doSearch();
  }, []);

  const doSearch = () => {
    dispatch(actions.resetData('search'));
    dispatch(
      actions.getData(
        'search',
        {
          name: '',
        },
        'data',
      ),
    );
  };

  const onBackPress = () => {
    rootNavigation.goBack();
  };

  const renderItem = (item: IConversation) => {
    return (
      <PrimaryItem
        title={item.name}
        LeftComponent={
          <Avatar.Large
            // style={styles.marginRight}
            source={item.avatar}
            placeholderSource={images.img_user_avatar_default}
          />
        }
      />
    );
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
          //   onChangeText={onQueryChanged}
        />
      </View>
      <ListView data={search.data} renderItem={renderItem} />
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme, insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputSearch: {
      flex: 1,
    },
  });
};

export default SearchConversation;
