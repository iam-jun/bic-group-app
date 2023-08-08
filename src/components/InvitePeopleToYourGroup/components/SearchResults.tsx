import {
  StyleSheet, View, FlatList, ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { dimension, spacing } from '~/theme';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import images from '~/resources/images';
import { IObject } from '~/interfaces/common';
import { IJoinableUsers } from '~/interfaces/IGroup';
import useGroupJoinableUsersStore from '../store';
import { WARNING_SECTION } from '../index';

interface Props {
  data: IObject<IJoinableUsers>;
  selectedUsers: string[];
  loading?: boolean;
  onLoadMore: () => void;
  onSelectUser: (userId: string) => void;
}

const SearchResults = ({
  data, selectedUsers, loading: loadingView = false, onLoadMore, onSelectUser,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();

  const { ids, loading, hasNextPage } = useGroupJoinableUsersStore((state) => state.users);

  const renderEmpty = () => (!!loading ? null : <NoSearchResultsFound />);

  const renderItemUser = ({ item }: { item: string; index: number }) => {
    const isSelected = selectedUsers.includes(item);
    const isDisabledCheckbox
      = (selectedUsers.length === WARNING_SECTION.MAX || loadingView) && isSelected
        ? 'disabled-auto-selected'
        : selectedUsers.length === WARNING_SECTION.MAX || loadingView
          ? 'disabled'
          : undefined;
    const isDisabledText = selectedUsers.length === WARNING_SECTION.MAX || loadingView;
    const colorText = loadingView ? colors.transparent1 : colors.neutral70;
    const currentUser = data[item];
    const { fullname, avatar } = currentUser;

    return (
      <PrimaryItem
        showAvatar
        style={styles.item}
        avatar={avatar || images.img_user_avatar_default}
        avatarProps={{ isRounded: true, variant: 'small' }}
        ContentComponent={(
          <Text.BodyMMedium ellipsizeMode="middle" color={colorText} numberOfLines={2}>
            {fullname}
          </Text.BodyMMedium>
        )}
        isChecked={isSelected}
        checkboxProps={{ testID: 'search_results.checkbox', disabled: isDisabledCheckbox }}
        onPressCheckbox={() => onSelectUser(item)}
        onPress={() => !isDisabledText && onSelectUser(item)}
      />
    );
  };

  const renderFooterComponent = () => {
    if (ids.length === 0) return null;
    if (!hasNextPage && ids.length > 0) {
      return (
        <Text.BodyM style={styles.footerContainer} color={colors.neutral30} useI18n>
          common:text_you_have_seen_it_all
        </Text.BodyM>
      );
    }
    return (
      <View testID="search_results.loading_more">
        <ActivityIndicator />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container} testID="search_results.loading">
        <ActivityIndicator color={colors.neutral40} />
      </View>
    );
  }

  return (
    <FlatList
      data={ids}
      style={styles.container}
      initialNumToRender={15}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooterComponent}
      renderItem={renderItemUser}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const createStyles = () => StyleSheet.create({
  container: { height: dimension.heightListInModal },
  footerContainer: {
    alignSelf: 'center',
    marginTop: spacing.margin.large,
  },
  item: {
    paddingHorizontal: 0,
  },
});

export default SearchResults;
