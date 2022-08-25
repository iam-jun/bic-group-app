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
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import homeKeySelector from '~/storeRedux/home/keySelector';
import { useBaseHook } from '~/hooks';
import homeActions from '~/storeRedux/home/actions';
import { ISelectedFilterUser } from '~/interfaces/IHome';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Icon from '~/baseComponents/Icon';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface NFSFilterCreateBySpecificProps {
  onSelect?: (selected?: ISelectedFilterUser) => void;
  onBack?: () => void;
}

const FilterCreateBySpecific: FC<NFSFilterCreateBySpecificProps> = ({
  onSelect,
  onBack,
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
        data={data || []}
        renderItem={renderItem}
        keyExtractor={(item) => `newsfeed_search_user_${item?.id}`}
        keyboardShouldPersistTaps="always"
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

export default FilterCreateBySpecific;
