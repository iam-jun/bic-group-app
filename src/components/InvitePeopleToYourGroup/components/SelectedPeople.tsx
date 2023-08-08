import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import images from '~/resources/images';
import { IJoinableUsers } from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';

interface Props {
  data: IObject<IJoinableUsers>;
  selectedUsers: string[];
  loading?: boolean;
  onSelectUser: (userId: string) => void;
}

const SelectedPeople = ({
  data, selectedUsers, loading = false, onSelectUser,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();

  const pointerEvents = loading ? 'none' : 'auto';
  const colorText = loading ? theme.colors.transparent1 : theme.colors.neutral40;

  const renderItem = ({ item }: { item: string; index: number }) => {
    const currentUser = data[item];
    const { avatar, fullname } = currentUser;

    return (
      <View pointerEvents={pointerEvents} style={styles.itemSelectedUser}>
        <Avatar.Base
          isRounded
          source={avatar}
          actionIcon="Xmark"
          placeholderSource={images.img_user_avatar_default}
          onPressAction={() => onSelectUser(item)}
        />
        <ViewSpacing height={spacing.margin.small} />
        <Text.BodyS maxLength={10} color={colorText}>
          {fullname}
        </Text.BodyS>
      </View>
    );
  };

  if (selectedUsers.length === 0) return null;

  return (
    <View style={styles.container} testID="chosen_people">
      <FlatList
        horizontal
        data={selectedUsers}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <ViewSpacing width={spacing.margin.base} />}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    marginTop: spacing.margin.large,
  },
  itemSelectedUser: {
    alignItems: 'center',
    marginTop: spacing.margin.small,
  },
});

export default SelectedPeople;
