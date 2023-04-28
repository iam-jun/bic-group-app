import { StyleSheet, FlatList, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import images from '~/resources/images';
import { useBaseHook } from '~/hooks';
import { IJoinableUsers } from '~/interfaces/IGroup';
import { IObject } from '~/interfaces/common';

interface Props {
  data: IObject<IJoinableUsers>;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
}

const ChosenPeople = ({ data, selectedUsers, onSelectUser }: Props) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();

  const renderItem = ({ item }: {item: string; index: number}) => {
    const currentUser = data[item];
    const { avatar, fullname } = currentUser;

    return (
      <View style={styles.itemSelectedUser}>
        <Avatar.Base
          isRounded
          source={avatar}
          actionIcon="Xmark"
          placeholderSource={images.img_user_avatar_default}
          onPressAction={() => onSelectUser(item)}
        />
        <ViewSpacing height={spacing.margin.small} />
        <Text.BodyS maxLength={10} color={theme.colors.neutral40}>
          {fullname}
        </Text.BodyS>
      </View>
    );
  };

  if (selectedUsers.length === 0) return null;

  return (
    <View style={styles.container} testID="chosen_people">
      <Text.SubtitleM
        testID="chosen_people.title"
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
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    marginBottom: spacing.margin.extraLarge,
  },
  itemSelectedUser: {
    alignItems: 'center',
    paddingTop: spacing.padding.base,
  },
  marginHorizontal: {
    marginHorizontal: spacing.margin.large,
  },
});

export default ChosenPeople;
