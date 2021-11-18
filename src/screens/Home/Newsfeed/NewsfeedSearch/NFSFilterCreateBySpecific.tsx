import React, {FC, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {debounce} from 'lodash';
import {useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {ITheme} from '~/theme/interfaces';

import {useKeySelector} from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import {useBaseHook} from '~/hooks';
import homeActions from '~/screens/Home/redux/actions';
import Divider from '~/beinComponents/Divider';
import modalActions from '~/store/modal/actions';
import {ISelectedFilterUser} from '~/interfaces/IHome';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

export interface NFSFilterCreateBySpecificProps {
  onSelect?: (selected?: ISelectedFilterUser) => void;
}

const NFSFilterCreateBySpecific: FC<NFSFilterCreateBySpecificProps> = ({
  onSelect,
}: NFSFilterCreateBySpecificProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {key, offset, limit, data, canLoadMore, loading} =
    useKeySelector(homeKeySelector.newsfeedSearchUsers) || {};

  useEffect(() => {
    dispatch(homeActions.getSearchUsers(''));
  }, []);

  const onChangeText = debounce((text: string) => {
    dispatch(homeActions.getSearchUsers(text));
  }, 200);

  const onPressUser = (user: any) => {
    dispatch(modalActions.hideModal());
    onSelect?.({id: `${user?.id}`, name: user?.fullname});
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity onPress={() => onPressUser(item)}>
        <PrimaryItem
          height={Platform.OS === 'web' ? 48 : 40}
          title={item?.fullname}
          showAvatar
          avatar={item?.avatar}
          avatarProps={{variant: Platform.OS === 'web' ? 'medium' : 'small'}}
          style={styles.item}
        />
      </TouchableOpacity>
    );
  };

  const onEndReached = () => {
    if (canLoadMore) {
      dispatch(homeActions.getSearchUsers());
    }
  };

  const renderFooter = () => {
    if (canLoadMore) {
      return (
        <ActivityIndicator
          style={{marginVertical: spacing.margin.base}}
          color={theme.colors.bgFocus}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <SearchInput
        style={styles.searchInput}
        placeholder={t('home:newsfeed_search:search_people')}
        onChangeText={onChangeText}
      />
      <Divider style={styles.divider} />
      <FlatList
        data={data || []}
        renderItem={renderItem}
        keyExtractor={item => `newsfeed_search_user_${item?.id}`}
        keyboardShouldPersistTaps={'always'}
        ListHeaderComponent={<View style={{height: spacing.margin.base}} />}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      height:
        Platform.select({web: 0.55, default: 0.5}) * dimension?.deviceHeight,
      paddingTop: Platform.OS === 'web' ? spacing.padding.base : 0,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    searchInput: {
      marginHorizontal: 24,
    },
    divider: {
      marginTop: spacing.margin.base,
      marginHorizontal: spacing.margin.extraLarge,
    },
    item: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
  });
};

export default NFSFilterCreateBySpecific;
