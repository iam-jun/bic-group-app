import i18next from 'i18next';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import SearchInput, {
  SearchInputProps,
} from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import {IUser} from '~/interfaces/IAuth';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
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
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {spacing} = theme;

  const renderItemUser = ({item}: {item: IUser; index: number}) => {
    return (
      <PrimaryItem
        title={item.name}
        isChecked={item.selected}
        onPressMenu={onPressMenu ? () => onPressMenu(item) : undefined}
        LeftComponent={
          <Avatar.Large
            style={styles.marginRight}
            source={item.avatar}
            placeholderSource={images.img_user_avatar_default}
          />
        }
        onPressCheckbox={selectable ? () => onSelectUser(item) : undefined}
      />
    );
  };

  const renderItemSelectedUser = ({item}: {item: IUser; index: number}) => {
    return (
      <View style={styles.itemSelectedUser}>
        <Avatar.Large
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
  };

  const renderRoles = () => (
    <View>
      {roles && roles.data.length > 0 && (
        <ListView
          title={i18next.t('common:title_admin')}
          {...roles}
          renderItem={renderItemUser}
        />
      )}
      {data.length > 0 && (
        <Text.ButtonBase style={styles.title}>
          {i18next.t(title)}
        </Text.ButtonBase>
      )}
    </View>
  );

  const EmptyComponent = () => <NoSearchResult />;

  return (
    <View style={styles.container}>
      <SearchInput style={styles.searchInput} {...searchInputProps} />
      <ViewSpacing height={spacing?.margin.base} />
      {selectable && selectedUsers.length > 0 && (
        <ListView
          title={i18next.t('common:text_chosen')}
          data={selectedUsers}
          horizontal
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
        ListEmptyComponent={EmptyComponent}
        renderItem={renderItemUser}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {dimension, spacing} = theme;
  return StyleSheet.create({
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
      paddingHorizontal: spacing?.margin.base,
    },
    itemSelectedUser: {
      width: dimension?.avatarSizes.large,
    },
  });
};

export default MembersSelection;
