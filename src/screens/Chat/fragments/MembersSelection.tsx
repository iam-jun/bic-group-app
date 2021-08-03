import i18next from 'i18next';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import SearchInput, {
  SearchInputProps,
} from '~/beinComponents/inputs/SearchInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import {Text, ViewSpacing} from '~/components';
import useChat from '~/hooks/chat';
import {IUser} from '~/interfaces/IAuth';
import {ITheme} from '~/theme/interfaces';
import actions from '../redux/actions';

export interface MembersSelectionProps {
  searchInputProps?: SearchInputProps;
  selectable?: boolean;
  data: IUser[];
  onPressMenu?: (user: IUser) => void;
}

const MembersSelection: React.FC<MembersSelectionProps> = ({
  selectable,
  searchInputProps,
  data,
  onPressMenu,
}: MembersSelectionProps): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {spacing} = theme;

  const dispatch = useDispatch();
  const {selectedUsers} = useChat();

  useEffect(() => {
    dispatch(actions.getUsers());
  }, []);

  const onSelectUser = (user: IUser) => {
    dispatch(actions.selectUser(user));
  };

  const renderItemUser = ({item}: {item: IUser; index: number}) => {
    return (
      <PrimaryItem
        title={item.name}
        isChecked={item.selected}
        onPressMenu={onPressMenu ? () => onPressMenu(item) : undefined}
        LeftComponent={
          <Avatar.Large style={styles.marginRight} source={item.avatar} />
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
          onPressAction={() => onSelectUser(item)}
        />
        <ViewSpacing height={spacing?.margin.small} />
        <Text.H6 numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text.H6>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchInput style={styles.searchInput} {...searchInputProps} />
      <ViewSpacing height={spacing?.margin.base} />
      {selectedUsers.length > 0 && (
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
        title={i18next.t('common:text_all')}
        data={data}
        renderItem={renderItemUser}
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
