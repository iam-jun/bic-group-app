import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import Icon, {IconProps} from '~/beinComponents/Icon';
import Text, {TextProps, TextVariant} from '~/beinComponents/Text';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import spacing from '~/theme/spacing';

interface DrawerItemProps {
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  icon: any;
  tintColor?: string;
  iconProps?: IconProps;
  titleContainer?: StyleProp<ViewStyle>;
  title: string;
  textVariant?: TextVariant;
  titleProps?: TextProps;
  subTitle?: string;
  textVariantSubTitle?: TextVariant;
  subTitleProps?: TextProps;
  rightStyle?: StyleProp<ViewStyle>;
  rightTitle?: string;
  textVariantRightTitle?: TextVariant;
  rightTitleProps?: TextProps;
  rightIcon?: any;
  rightTintColor?: string;
  rightIconProps?: IconProps;
  RightComponent?: React.ReactNode | React.ReactElement;
}

const MenuSidebarItem: React.FC<DrawerItemProps> = ({
  disabled,
  onPress,
  style,
  testID,
  icon,
  tintColor,
  iconProps,
  titleContainer,
  title,
  textVariant,
  titleProps,
  subTitle,
  textVariantSubTitle,
  subTitleProps,
  rightStyle,
  rightTitle,
  textVariantRightTitle,
  rightTitleProps,
  rightIcon,
  rightTintColor,
  rightIconProps,
  RightComponent,
}: DrawerItemProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme = useTheme() as ITheme;
  const {colors} = theme;

  return (
    <TouchableOpacity
      disabled={!isInternetReachable || disabled}
      onPress={onPress}
      testID={testID}>
      <View style={[styles.container, style]}>
        {icon && (
          <Icon
            icon={icon}
            size={24}
            tintColor={tintColor || colors.primary6}
            {...iconProps}
          />
        )}
        <View
          style={StyleSheet.flatten([styles.titleContainer, titleContainer])}>
          <Text variant={textVariant || 'body'} useI18n {...titleProps}>
            {title}
          </Text>
          {!!subTitle && (
            <Text
              variant={textVariantSubTitle || 'subtitle'}
              useI18n
              numberOfLines={2}
              {...subTitleProps}>
              {subTitle}
            </Text>
          )}
        </View>
        <View style={StyleSheet.flatten([styles.right, rightStyle])}>
          {!!rightTitle && (
            <Text
              variant={textVariantRightTitle || 'subtitle'}
              useI18n
              style={{color: colors.textSecondary}}
              {...rightTitleProps}>
              {rightTitle}
            </Text>
          )}
          {!!rightIcon && (
            <Icon
              icon={rightIcon}
              size={20}
              style={styles.rightIcon}
              tintColor={rightTintColor || colors.textSecondary}
              {...rightIconProps}
            />
          )}
        </View>
        {RightComponent}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.padding.base,
    paddingLeft: spacing.padding.large,
    paddingRight: spacing.padding.base,
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.margin.base,
  },
  right: {
    flexDirection: 'row',
  },
  rightIcon: {
    height: 36,
    width: 36,
    padding: spacing.padding.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuSidebarItem;
