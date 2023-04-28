import {
  StyleSheet, View, FlatList, ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import images from '~/resources/images';
import useGroupJoinableUsersStore from '../store';
import { IObject } from '~/interfaces/common';
import { IJoinableUsers } from '~/interfaces/IGroup';

interface Props {
  data: IObject<IJoinableUsers>;
  selectedUsers: string[];
  onLoadMore: () => void;
  onSelectUser: (userId: string) => void;
}

const SearchResults = ({
  data,
  selectedUsers,
  onLoadMore,
  onSelectUser,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const insets = useSafeAreaInsets();

  const { ids, loading, hasNextPage } = useGroupJoinableUsersStore((state) => state.users);

  const renderEmpty = () => (!!loading ? null : <NoSearchResultsFound />);

  const renderItemUser = ({ item }: {item: string; index: number}) => {
    const isSelected = selectedUsers.includes(item);
    const currentUser = data[item];
    const { fullname, username, avatar } = currentUser;

    return (
      <PrimaryItem
        showAvatar
        style={styles.paddingHorizontal}
        avatar={avatar || images.img_user_avatar_default}
        avatarProps={{ isRounded: true, variant: 'small' }}
        ContentComponent={(
          <>
            <Text.BodyMMedium ellipsizeMode="middle" color={colors.neutral70} numberOfLines={1}>
              {fullname}
            </Text.BodyMMedium>
            <Text.BodyS color={colors.neutral40} numberOfLines={1}>{`@${username}`}</Text.BodyS>
          </>
        )}
        isChecked={isSelected}
        checkboxProps={{ testID: 'search_results.checkbox' }}
        onPressCheckbox={() => onSelectUser(item)}
      />
    );
  };

  const renderFooterComponent = () => {
    if (!hasNextPage) return <ViewSpacing height={insets.bottom || spacing.padding.large} />;

    return (
      <View style={styles.boxFooter} testID="search_results.loading_more">
        <ActivityIndicator />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingIndicator} testID="search_results.loading">
        <ActivityIndicator color={colors.neutral40} />
      </View>
    );
  }

  return (
    <>
      <Text.SubtitleM
        color={colors.neutral60}
        style={styles.marginHorizontal}
        testID="search_results.title"
        useI18n
      >
        common:text_search_results
      </Text.SubtitleM>
      <ViewSpacing height={spacing.margin.tiny} />
      <FlatList
        data={ids}
        style={styles.flex1}
        initialNumToRender={15}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooterComponent}
        renderItem={renderItemUser}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
};

const createStyles = () => StyleSheet.create({
  flex1: { flex: 1 },
  loadingIndicator: { marginTop: spacing.margin.extraLarge },
  marginHorizontal: { marginHorizontal: spacing.margin.large },
  paddingHorizontal: { paddingHorizontal: spacing.padding.large },
  boxFooter: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchResults;
