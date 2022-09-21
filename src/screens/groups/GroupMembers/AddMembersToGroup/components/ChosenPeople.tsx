import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IUser } from '~/interfaces/IAuth';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/beinComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import images from '~/resources/images';
import { useBaseHook } from '~/hooks';

interface Props {
  selectedUsers: IUser[];
  onSelectUser: (user: IUser) => void;
}

const ChosenPeople = ({ selectedUsers, onSelectUser }: Props) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();

  const renderItem = ({ item }: {item: IUser; index: number}) => (
    <View style={styles.itemSelectedUser}>
      <Avatar.Base
        isRounded
        source={item.avatar}
        actionIcon="Xmark"
        placeholderSource={images.img_user_avatar_default}
        onPressAction={() => onSelectUser(item)}
      />
      <ViewSpacing height={spacing.margin.small} />
      <Text.BodyS numberOfLines={1} ellipsizeMode="tail" color={theme.colors.neutral40}>
        {item.name}
      </Text.BodyS>
    </View>
  );

  if (selectedUsers.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text.SubtitleM
        color={theme.colors.neutral60}
        style={styles.marginHorizontal}
        useI18n
      >
        {`${t('common:text_chosen')}:  ${selectedUsers.length}`}
      </Text.SubtitleM>

      <FlatList
        horizontal
        style={styles.marginHorizontal}
        data={selectedUsers}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <ViewSpacing width={spacing.margin.base} />}
      />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    marginBottom: spacing.margin.extraLarge,
  },
  itemSelectedUser: {
    width: 70,
    alignItems: 'center',
    paddingTop: spacing.padding.base,
  },
  marginHorizontal: {
    marginHorizontal: spacing.margin.large,
  },
});

export default ChosenPeople;
