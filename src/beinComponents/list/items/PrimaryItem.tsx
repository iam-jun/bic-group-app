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

export interface PrimaryItemProps {
  style?: StyleProp<ViewStyle>;
  height?: number;
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
  onPress?: () => void;
  onPressCheckbox?: (action: IAction) => void;
  toggleChecked?: boolean;
  onPressToggle?: (action: IAction) => void;
  onPressEdit?: () => void;
  onPressMenu?: (e: any) => void;
  LeftComponent?: React.ReactNode | React.ReactElement;
  RightComponent?: React.ReactNode | React.ReactElement;
  ContentComponent?: React.ReactNode | React.ReactElement;
}

const PrimaryItem: React.FC<PrimaryItemProps> = ({
  style,
  height,
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
  RightComponent,
  ContentComponent,
}: PrimaryItemProps) => {
  const theme = useTheme() as ITheme;
  const {dimension, spacing} = theme;
  const styles = createStyle(theme);

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      height: height || dimension?.primaryItemHeight,
      alignItems: 'center',
      paddingHorizontal: spacing?.padding.base,
    },
    style,
  ]);

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={containerStyle}>
      {LeftComponent}
      {(showAvatar || !!avatar) && (
        <Avatar.Medium source={avatar} style={styles.avatar} {...avatarProps} />
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
          icon={'Edit'}
          onPress={onPressEdit}
        />
      )}
      {onPressMenu && (
        <Icon
          style={styles.iconMarginLeft}
          onPress={onPressMenu}
          icon={'EllipsisV'}
        />
      )}
      {RightComponent}
    </TouchableOpacity>
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
