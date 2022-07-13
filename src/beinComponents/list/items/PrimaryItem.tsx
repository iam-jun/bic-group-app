import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Text, {TextProps} from '~/beinComponents/Text';
import Icon, {IconProps} from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Checkbox, {
  CheckboxProps,
} from '~/beinComponents/SelectionControl/Checkbox';
import Toggle from '~/beinComponents/SelectionControl/Toggle';
import {IAction} from '~/constants/commonActions';
import {IconType} from '~/resources/icons';
import Avatar from '~/beinComponents/Avatar';
import {AvatarProps} from '~/beinComponents/Avatar/AvatarComponent';
import {primaryItemHeight} from '~/theme/dimension';

export interface PrimaryItemProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  height?: number | null;
  title?: string | React.ReactNode;
  titleProps?: TextProps;
  subTitle?: string | React.ReactNode;
  subTitleProps?: TextProps;
  showAvatar?: boolean;
  avatar?: string;
  avatarProps?: AvatarProps;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
  isChecked?: boolean;
  checkboxProps?: CheckboxProps;
  toggleChecked?: boolean;
  menuIconTestID?: string;
  LeftComponent?: React.ReactNode | React.ReactElement;
  RightComponent?: React.ReactNode | React.ReactElement;
  ContentComponent?: React.ReactNode | React.ReactElement;

  onPress?: () => void;
  onPressCheckbox?: (action: IAction) => void;
  onPressToggle?: (action: IAction) => void;
  onPressEdit?: () => void;
  onPressMenu?: (e: any) => void;
}

const PrimaryItem: React.FC<PrimaryItemProps> = ({
  style,
  testID,
  height = primaryItemHeight,
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
  const theme = useTheme() as ITheme;
  const {spacing} = theme;
  const styles = createStyle(theme);

  const containerStyle: ViewStyle = StyleSheet.flatten([
    {
      flexDirection: 'row',
      height: height,
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
        onPress={onPress}>
        {LeftComponent}
        {(showAvatar || !!avatar) && (
          <Avatar.Medium
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
            <Text variant="h6" numberOfLines={2} {...titleProps}>
              {title}
            </Text>
          )}
          {!!subTitle && (
            <Text variant="body" numberOfLines={2} {...subTitleProps}>
              {subTitle}
            </Text>
          )}
          {ContentComponent}
        </View>
        {onPressCheckbox && (
          <Checkbox
            style={styles.iconMarginLeft}
            isChecked={isChecked}
            onActionPress={onPressCheckbox}
            {...checkboxProps}
          />
        )}
        {onPressToggle && (
          <Toggle
            style={styles.iconMarginLeft}
            isChecked={toggleChecked}
            onActionPress={onPressToggle}
          />
        )}
        {onPressEdit && (
          <Icon
            style={styles.iconMarginLeft}
            icon={'edit'}
            onPress={onPressEdit}
          />
        )}
        {onPressMenu && (
          <Icon
            style={styles.iconMarginLeft}
            onPress={onPressMenu}
            icon={'menu'}
            testID={menuIconTestID}
          />
        )}
        {RightComponent}
      </TouchableOpacity>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    contentContainer: {flex: 1},
    iconMarginRight: {
      marginRight: spacing?.margin.extraLarge,
    },
    iconMarginLeft: {
      marginLeft: spacing?.margin.extraLarge,
    },
    avatar: {
      marginRight: spacing?.margin.base,
    },
  });
};

export default PrimaryItem;
