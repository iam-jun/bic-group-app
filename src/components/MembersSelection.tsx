import i18next from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import SearchInput, {
  SearchInputProps,
} from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import { IUser } from '~/interfaces/IAuth';
import images from '~/resources/images';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import NoSearchResult from './NoSearchResult';

export interface MembersSelectionProps {
  searchInputProps?: SearchInputProps;
  selectable?: boolean;
  title: string;
  data: IUser[];
  roles?: {
    loading: boolean;
    data: IUser[];
  };
  loading?: boolean;
  onPressMenu?: (user: IUser) => void;
  onLoadMore: () => void;
  selectedUsers: IUser[];
  onSelectUser: (user: IUser) => void;
  emptyTitle?: string;
}

const MembersSelection: React.FC<MembersSelectionProps> = ({
  selectable,
  searchInputProps,
  title,
  data,
  roles,
  loading,
  onPressMenu,
  onLoadMore,
  selectedUsers,
  onSelectUser,
}: MembersSelectionProps): React.ReactElement => {
  const theme: ExtendedTheme = useTheme();

  const renderItemUser = ({ item }: {item: IUser; index: number}) => {
    const selected = selectedUsers.find((user: IUser) => user.id === item.id);

    return (
      <PrimaryItem
        ContentComponent={(
          <Text.H6 numberOfLines={2}>
            {item.name}
            <Text.BodyS
              color={theme.colors.gray50}
            >
              {` @${item.username}`}
            </Text.BodyS>
          </Text.H6>
        )}
        isChecked={!!selected}
        checkboxProps={{ testID: 'members_selection.checkbox' }}
        onPressMenu={onPressMenu ? () => onPressMenu(item) : undefined}
        LeftComponent={(
          <Avatar.Medium
            style={styles.marginRight}
            source={item.avatar}
            placeholderSource={images.img_user_avatar_default}
          />
        )}
        onPressCheckbox={selectable ? () => onSelectUser(item) : undefined}
      />
    );
  };

  const renderItemSelectedUser = ({ item }: {item: IUser; index: number}) => (
    <View style={styles.itemSelectedUser}>
      <Avatar.Medium
        source={item.avatar}
        actionIcon="iconClose"
        placeholderSource={images.img_user_avatar_default}
        onPressAction={() => onSelectUser(item)}
      />
      <ViewSpacing height={spacing?.margin.small} />
      <Text.H6 numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text.H6>
    </View>
  );

  const renderRoles = () => (
    <View>
      {roles && roles.data.length > 0 && (
        <ListView
          title={i18next.t('common:text_admin')}
          {...roles}
          renderItem={renderItemUser}
        />
      )}
      {data.length > 0 && (
        <Text.ButtonM style={styles.title}>{i18next.t(title)}</Text.ButtonM>
      )}
    </View>
  );

  const renderEmpty = () => <NoSearchResult />;

  return (
    <View style={styles.container}>
      <SearchInput style={styles.searchInput} {...searchInputProps} />
      <ViewSpacing height={spacing?.margin.base} />
      {selectable && selectedUsers.length > 0 && (
        <ListView
          title={i18next.t('common:text_chosen')}
          data={selectedUsers}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItemSelectedUser}
          renderItemSeparator={() => (
            <ViewSpacing width={spacing?.margin.base} />
          )}
          listStyle={styles.selectedUsers}
        />
      )}

      <ViewSpacing height={spacing?.margin.base} />
      <ListView
        data={data}
        loading={loading}
        isFullView
        ListHeaderComponent={renderRoles}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItemUser}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginHorizontal: spacing?.margin.base,
  },
  title: {
    marginVertical: spacing.margin.small,
    marginHorizontal: spacing.margin.base,
  },
  marginRight: {
    marginRight: spacing?.margin.base,
  },
  selectedUsers: {
    marginHorizontal: spacing.margin.base,
  },
  itemSelectedUser: {
    width: dimension?.avatarSizes.large,
  },
});

export default MembersSelection;
