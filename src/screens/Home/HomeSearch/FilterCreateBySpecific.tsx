import React, { FC, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { TouchableOpacity as TouchableGestureHandler } from 'react-native-gesture-handler';

import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import { useBaseHook } from '~/hooks';
import homeActions from '~/screens/Home/redux/actions';
import Divider from '~/beinComponents/Divider';
import modalActions from '~/store/modal/actions';
import { ISelectedFilterUser } from '~/interfaces/IHome';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export interface NFSFilterCreateBySpecificProps {
  onSelect?: (selected?: ISelectedFilterUser) => void;
  dismissModalOnPress?: boolean;
}

const FilterCreateBySpecific: FC<NFSFilterCreateBySpecificProps> = ({
  onSelect,
  dismissModalOnPress,
}: NFSFilterCreateBySpecificProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();

  const { data, canLoadMore } = useKeySelector(homeKeySelector.newsfeedSearchUsers) || {};

  useEffect(
    () => {
      dispatch(homeActions.getSearchUsers(''));
    }, [],
  );

  const onChangeText = debounce(
    (text: string) => {
      dispatch(homeActions.getSearchUsers(text));
    }, 200,
  );

  const onPressUser = (user: any) => {
    dismissModalOnPress && dispatch(modalActions.hideModal());
    onSelect?.({ id: `${user?.id}`, name: user?.fullname });
  };

  const ItemWrapper: any = Platform.OS === 'android' ? TouchableGestureHandler : View;

  const renderItem = ({ item }: any) => (
    <ItemWrapper onPress={() => onPressUser(item)}>
      <PrimaryItem
        height={40}
        title={item?.fullname}
        showAvatar
        avatar={item?.avatar}
        avatarProps={{ variant: 'small' }}
        style={styles.item}
        onPress={() => onPressUser(item)}
      />
    </ItemWrapper>
  );

  const onEndReached = () => {
    if (canLoadMore) {
      dispatch(homeActions.getSearchUsers());
    }
  };

  const renderFooter = () => {
    if (canLoadMore) {
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
      <SearchInput
        style={styles.searchInput}
        placeholder={t('home:newsfeed_search:search_people')}
        onChangeText={onChangeText}
      />
      <Divider style={styles.divider} />
      <FlatList
        data={data || []}
        renderItem={renderItem}
        keyExtractor={(item) => `newsfeed_search_user_${item?.id}`}
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={<View style={{ height: spacing.margin.base }} />}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.deviceHeight * 0.5,
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

export default FilterCreateBySpecific;
