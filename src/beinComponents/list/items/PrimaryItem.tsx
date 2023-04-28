import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Text, { TextProps } from '~/baseComponents/Text';
import Icon, { IconProps } from '~/baseComponents/Icon';
import Checkbox, { CheckboxProps } from '~/baseComponents/Checkbox';
import Toggle from '~/baseComponents/Toggle';
import { IconType } from '~/resources/icons';
import Avatar from '~/baseComponents/Avatar';
import { AvatarProps } from '~/baseComponents/Avatar/AvatarComponent';
import spacing from '~/theme/spacing';
import DeactivatedView from '~/components/DeactivatedView';

type ItemIconProps = Omit<IconProps, 'icon'>
export interface PrimaryItemProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title?: string | React.ReactNode;
  titleProps?: TextProps;
  subTitle?: string | React.ReactNode;
  subTitleProps?: TextProps;
  showAvatar?: boolean;
  avatar?: string;
  avatarProps?: AvatarProps;
  leftIcon?: IconType;
  leftIconProps?: ItemIconProps;
  isChecked?: boolean;
  isDeactivated?: boolean;
  checkboxProps?: CheckboxProps;
  toggleChecked?: boolean;
  menuIconTestID?: string;
  LeftComponent?: React.ReactNode | React.ReactElement;
  RightComponent?: React.ReactNode | React.ReactElement;
  ContentComponent?: React.ReactNode | React.ReactElement;

  onPress?: () => void;
  onPressCheckbox?: (isChecked?: boolean) => void;
  onPressToggle?: (isChecked?: boolean) => void;
  onPressEdit?: () => void;
  onPressMenu?: (e: any) => void;
}

const PrimaryItem: React.FC<PrimaryItemProps> = ({
  style,
  testID,
  title,
  titleProps,
  showAvatar,
  avatar,
  avatarProps,
  subTitle,
  subTitleProps,
  leftIcon,
  leftIconProps,
  LeftComponent,
  isChecked,
  isDeactivated = false,
  checkboxProps,
  onPress,
  toggleChecked,
  onPressToggle,
  onPressCheckbox,
  onPressEdit,
  onPressMenu,
  menuIconTestID,
  RightComponent,
  ContentComponent,
}: PrimaryItemProps) => {
  const containerStyle: ViewStyle = StyleSheet.flatten([
    {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    } as ViewStyle,
    style,
  ]);

  const disabled = !onPress;

  return (
    <View>
      <TouchableOpacity
        style={containerStyle}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
      >
        {LeftComponent}
        {(showAvatar || !!avatar) && (
          <Avatar.Base
            source={avatar}
            style={styles.avatar}
            {...avatarProps}
          />
        )}
        {!!leftIcon && (
          <Icon
            size={14}
            style={styles.iconMarginRight}
            icon={leftIcon}
            {...leftIconProps}
          />
        )}
        <View style={styles.contentContainer}>
          {!!title && (
            <View style={styles.titleContainer}>
              <Text testID="primary_item.title" variant="h6" numberOfLines={2} {...titleProps} style={styles.title}>
                {title}
              </Text>
              {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
            </View>
          )}
          {!!subTitle && (
            <Text testID="primary_item.subTitle" variant="bodyM" numberOfLines={2} {...subTitleProps}>
              {subTitle}
            </Text>
          )}
          {ContentComponent}
        </View>
        {onPressCheckbox && (
          <Checkbox
            style={styles.iconMarginLeft}
            isChecked={isChecked}
            onPress={onPressCheckbox}
            {...checkboxProps}
          />
        )}
        {onPressToggle && (
          <Toggle
            style={styles.iconMarginLeft}
            isChecked={toggleChecked}
            onValueChanged={onPressToggle}
          />
        )}
        {onPressEdit && (
          <Icon
            style={styles.iconMarginLeft}
            icon="edit"
            onPress={onPressEdit}
          />
        )}
        {onPressMenu && (
          <Icon
            style={styles.iconMarginLeft}
            onPress={onPressMenu}
            icon="menu"
            testID={menuIconTestID}
          />
        )}
        {RightComponent}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flex: 1 },
  iconMarginRight: {
    marginRight: spacing?.margin.extraLarge,
  },
  iconMarginLeft: {
    marginLeft: spacing?.margin.extraLarge,
  },
  avatar: {
    marginRight: spacing?.margin.base,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deactivatedView: {
    marginLeft: spacing.margin.tiny,
    alignSelf: 'center',
  },
  title: {
    flexShrink: 1,
  },
});

export default PrimaryItem;
