import {
  StyleSheet, View, FlatList, ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import { IUser } from '~/interfaces/IAuth';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import images from '~/resources/images';

interface Props {
  loading: boolean;
  data: IUser[];
  selectedUsers: IUser[];
  onLoadMore: () => void;
  onSelectUser: (user: IUser) => void;
}

const SearchResults = ({
  loading,
  data,
  selectedUsers,
  onLoadMore,
  onSelectUser,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();

  const renderEmpty = () => (!!loading ? null : <NoSearchResultsFound />);

  const renderItemUser = ({ item }: {item: IUser; index: number}) => {
    const selected = selectedUsers.find((user: IUser) => user.id === item.id);
    const { name, username } = item;

    return (
      <PrimaryItem
        showAvatar
        style={styles.paddingHorizontal}
        avatar={item.avatar || images.img_user_avatar_default}
        avatarProps={{ isRounded: true, variant: 'small' }}
        ContentComponent={(
          <>
            <Text.BodyMMedium ellipsizeMode="middle" color={colors.neutral70} numberOfLines={1}>
              {name}
            </Text.BodyMMedium>
            <Text.BodyS color={colors.neutral40} numberOfLines={1}>{`@${username}`}</Text.BodyS>
          </>
        )}
        isChecked={!!selected}
        checkboxProps={{ testID: 'search_results.checkbox' }}
        onPressCheckbox={() => onSelectUser(item)}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator color={colors.neutral40} />
      </View>
    );
  }

  return (
    <>
      <Text.SubtitleM
        color={colors.neutral60}
        style={styles.marginHorizontal}
        useI18n
      >
        common:text_search_results
      </Text.SubtitleM>
      <ViewSpacing height={spacing.margin.tiny} />
      <FlatList
        data={data}
        style={styles.flex1}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItemUser}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
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
});

export default SearchResults;
