import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Text from '~/beinComponents/Text';
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
  title?: string;
  subTitle?: string;
  showAvatar?: boolean;
  avatar?: string;
  avatarProps?: AvatarProps;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
  isChecked?: boolean;
  checkboxProps?: CheckboxProps;
  onPress?: () => void;
  onPressCheckbox?: (action: IAction) => void;
  onPressToggle?: (action: IAction) => void;
  onPressEdit?: () => void;
  onPressMenu?: () => void;
  LeftComponent?: React.ReactElement;
  RightComponent?: React.ReactElement;
  ContentComponent?: React.ReactNode;
}

const PrimaryItem: React.FC<PrimaryItemProps> = ({
  style,
  height,
  title,
  showAvatar,
  avatar,
  avatarProps,
  subTitle,
  leftIcon,
  leftIconProps,
  LeftComponent,
  isChecked,
  checkboxProps,
  onPress,
  onPressToggle,
  onPressCheckbox,
  onPressEdit,
  onPressMenu,
  RightComponent,
  ContentComponent,
}: PrimaryItemProps) => {
  const theme: ITheme = useTheme();
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
        {!!title && <Text.H6 numberOfLines={2}>{title}</Text.H6>}
        {!!subTitle && <Text.Body numberOfLines={2}>{subTitle}</Text.Body>}
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
        <Toggle style={styles.iconMarginLeft} onActionPress={onPressToggle} />
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
