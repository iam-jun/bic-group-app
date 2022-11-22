import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Avatar, Button, CheckBox } from '~/baseComponents';
import { IGroup } from '~/interfaces/IGroup';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { IconType } from '~/resources/icons';
import Text from '~/baseComponents/Text';
import { dimension, spacing } from '~/theme';

export interface GroupItemProps {
  style?: StyleProp<ViewStyle>;
  item: IGroup;
  nameLines?: number;
  menuIcon?: IconType;
  isChecked?: boolean;
  checkboxDisabled?: boolean;

  onPress?: (item: IGroup) => void
  onMenuPress?: (item: IGroup) => void;
  onCheckboxPress?: (item: IGroup, isChecked: boolean) => void;
  shouldBeChecked?: (item: IGroup) => boolean;
  shouldCheckboxDisabled?: (item: IGroup) => boolean;
  renderItemExtraInfo?: (item: IGroup) => JSX.Element;
}

const GroupItem: FC<GroupItemProps> = ({
  style,
  item,
  menuIcon = 'menu',
  isChecked,
  checkboxDisabled,
  nameLines = 2,

  onPress,
  onMenuPress,
  onCheckboxPress,
  shouldBeChecked,
  shouldCheckboxDisabled,
  renderItemExtraInfo,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {
    icon, name, privacy,
  } = item;

  const privacyIcon = GroupPrivacyDetail[privacy]?.icon as IconType;

  const _isChecked = isChecked || shouldBeChecked?.(item);
  const _checkboxDisabled = checkboxDisabled || shouldCheckboxDisabled?.(item);

  const _onPress = () => onPress?.(item);
  const _onMenuPress = () => onMenuPress?.(item);
  const _onCheckboxPress = (isChecked: boolean) => onCheckboxPress?.(item, isChecked);

  return (
    <Button
      testID="group_item.container"
      style={[styles.container, style]}
      onPress={_onPress}
    >
      <Avatar.Base
        source={icon}
        privacyIcon={privacyIcon}
      />
      <View style={styles.textContainer}>
        <Text.BodyMMedium
          style={styles.textName}
          color={theme.colors.neutral60}
          numberOfLines={nameLines}
        >
          {name}
        </Text.BodyMMedium>
        {renderItemExtraInfo?.(item)}
      </View>
      {onCheckboxPress && (
        <CheckBox
          testID="group_item.check_box"
          style={styles.checkbox}
          isChecked={_isChecked}
          disabled={_checkboxDisabled ? 'disabled' : undefined}
          onPress={_onCheckboxPress}
        />
      )}
      {onMenuPress && (
      <View style={styles.btnMenu}>
        <Button.Raise
          icon={menuIcon}
          size="small"
          testID="group_item.button_menu"
          onPress={_onMenuPress}
        />
      </View>
      )}
    </Button>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.padding.base,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {
      width: '100%',
      justifyContent: 'center',
    },
    textInfo: {
      marginHorizontal: spacing.margin.tiny,
    },

    avatarContainer: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
    },
    checkbox: { },
    iconSmall: {
      height: 16,
    },
    privacyTitle: {
      marginLeft: spacing.margin.tiny,
    },
    btnMenu: {
      marginRight: spacing.margin.tiny,
      justifyContent: 'center',
    },
    schemeNameContainer: {
      backgroundColor: colors.neutral1,
      alignSelf: 'flex-start',
      marginVertical: 2,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.pill,
    },
  });
};

export default GroupItem;
