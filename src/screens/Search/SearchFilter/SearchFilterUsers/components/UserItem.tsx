import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Checkbox from '~/baseComponents/Checkbox';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import { ISearchUser } from '~/interfaces/ISearch';
import { Avatar } from '~/baseComponents';
import { getTextNameUserDisplay } from '~/helpers/common';

export interface UserItemProps {
  data: ISearchUser;
  isChecked?: boolean;
  disabled?: boolean;
  onRemoveItem?: (user: ISearchUser) => void;
  onAddItem?: (user: ISearchUser) => void;
  testIDCheckbox?: string;
  testIDItem?: string;
}

const UserItem: FC<UserItemProps> = ({
  data,
  isChecked,
  disabled = false,
  onRemoveItem,
  onAddItem,
  testIDCheckbox,
  testIDItem,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle();
  const { colors } = theme;

  const { username, avatar } = data || {};

  const onChange = (isChecked: boolean) => {
    if (isChecked) {
      onAddItem?.(data);
    } else {
      onRemoveItem?.(data);
    }
  };

  return (
    <View testID={testIDItem} style={styles.container}>
      <Avatar.Small source={{ uri: avatar }} isRounded />
      <View style={styles.usernameContainer}>
        <Text.BodySMedium color={colors.neutral60} numberOfLines={1}>
          {getTextNameUserDisplay(data)}
        </Text.BodySMedium>
        <Text.BodyXS color={colors.neutral30} numberOfLines={1}>
          {`@${username}`}
        </Text.BodyXS>
      </View>
      <Checkbox
        testID={testIDCheckbox}
        isChecked={isChecked}
        disabled={disabled ? 'disabled' : undefined}
        onPress={onChange}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
  usernameContainer: {
    flex: 1,
    marginHorizontal: spacing.margin.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UserItem;
