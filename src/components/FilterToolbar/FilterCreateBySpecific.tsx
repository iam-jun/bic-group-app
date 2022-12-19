import React, { FC, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBaseHook } from '~/hooks';
import { ISelectedFilterUser } from '~/interfaces/IHome';

import SearchInput from '~/baseComponents/Input/SearchInput';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Icon from '~/baseComponents/Icon';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useFilterToolbarStore from './store';
import appConfig from '~/configs/appConfig';

export interface NFSFilterCreateBySpecificProps {
  onSelect?: (selected?: ISelectedFilterUser) => void;
  onBack?: () => void;
}

const FilterCreateBySpecific: FC<NFSFilterCreateBySpecificProps> = ({
  onSelect,
  onBack,
}: NFSFilterCreateBySpecificProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();

  const actions = useFilterToolbarStore((state) => state.actions);
  const listUser = useFilterToolbarStore((state) => state.listUser);
  const searchData = useFilterToolbarStore((state) => state.search);
  const { items: userItems, hasNextPage: listUserCanLoadMore } = listUser;
  const { key: searchKey, items: searchItems, hasNextPage: searchUserCanLoadMore } = searchData || {};

  const listData = searchKey ? searchItems : userItems;

  useEffect(
    () => {
      actions.getPostUsers();
    }, [],
  );

  const onChangeText = debounce(
    (text: string) => {
      actions.searchPostUsers(text);
    }, appConfig.searchTriggerTime,
  );

  const onPressUser = (user: any) => {
    onSelect?.({ id: `${user?.id}`, name: user?.fullname });
  };

  const renderItem = ({ item }: any) => (
    <Button style={styles.rowItem} onPress={() => onPressUser(item)}>
      <Avatar.Base
        source={item?.avatar}
        isRounded
        variant="small"
      />
      <ViewSpacing width={spacing.padding.small} />
      <View style={{ flex: 1 }}>
        <Text.BodyMMedium numberOfLines={1}>{item?.fullname}</Text.BodyMMedium>
      </View>
    </Button>
  );

  const onEndReached = () => {
    if (!!searchKey) {
      actions.searchPostUsers(searchKey, true);
    } else {
      actions.getPostUsers(true);
    }
  };

  const renderFooter = () => {
    if (listUserCanLoadMore || searchUserCanLoadMore) {
      return (
        <ActivityIndicator
          style={{ marginVertical: spacing.margin.base }}
          color={theme.colors.gray20}
        />
      );
    }
    return null;
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.row}>
        <Icon
          icon="iconBack"
          onPress={onBack}
          size={24}
          hitSlop={{
            top: 20, bottom: 20, left: 20, right: 20,
          }}
          tintColor={theme.colors.neutral40}
        />
        <SearchInput
          style={styles.searchInput}
          placeholder={t('home:newsfeed_search:search_people')}
          onChangeText={onChangeText}
        />
      </View>
      <FlatList
        data={listData || []}
        renderItem={renderItem}
        keyExtractor={(item) => `newsfeed_search_user_${item?.id}`}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
      />
    </TouchableOpacity>
  );
};

const createStyles = () => {
  const insets = useSafeAreaInsets();
  const { deviceHeight, headerHeight } = dimension;
  const containerHeight = deviceHeight - headerHeight - insets.top;

  return StyleSheet.create({
    container: {
      height: containerHeight,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.extraLarge,
      marginTop: spacing.margin.large,
    },
    searchInput: {
      marginLeft: spacing.margin.large,
      flex: 1,
    },
    rowItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.extraLarge,
    },
  });
};

export default FilterCreateBySpecific;
