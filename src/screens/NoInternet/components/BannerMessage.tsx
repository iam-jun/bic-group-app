import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import Button from '~/beinComponents/Button';

export interface BannerMessageProps {
  type?: 'error' | 'success';
  children?: React.ReactNode;
  textProps?: TextProps;
  leftIcon?: IconType;
  rightIcon?: IconType;
  rightText?: string;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
  onPressRight?: () => void;
}

const BannerMessage: FC<BannerMessageProps> = ({
  type = 'error',
  children,
  textProps,
  leftIcon,
  rightIcon,
  rightText,
  style,
  onActionPress,
  onPressRight,
}: BannerMessageProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const _onPress = () => {
    onActionPress?.();
  };

  const BannerMessageStyle = {
    success: {
      iconColor: colors.background,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.success,
    },
    error: {
      iconColor: colors.background,
      textColor: colors.iconTintReversed,
      backgroundColor: colors.error,
    },
  };

  const {iconColor, textColor, backgroundColor} =
    BannerMessageStyle[type] || BannerMessageStyle.success;

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flexDirection: 'row',
      backgroundColor: backgroundColor,
      padding: spacing.padding.small,
      alignSelf: 'baseline',
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={containerStyle}
      onPress={_onPress}>
      {leftIcon && (
        <Icon
          iconStyle={styles.leftIconStyle}
          style={styles.leftIcon}
          icon={leftIcon}
          tintColor={iconColor}
        />
      )}

      <View style={styles.textContainer}>
        <View style={styles.childrenStyle}>
          <Text.Body
            {...textProps}
            color={textColor}
            style={styles.descriptionText}>
            {children}
          </Text.Body>
        </View>

        {!!onPressRight && !!rightText && (
          <Button.Secondary style={styles.button} onPress={onPressRight}>
            {!!rightIcon && (
              <Icon icon={rightIcon} style={styles.marginRightIcon} />
            )}
            <Text.ButtonBase style={styles.rightText}>
              {rightText}
            </Text.ButtonBase>
          </Button.Secondary>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    childrenStyle: {
      flex: 1,
    },
    descriptionText: {
      fontSize: 15,
    },
    leftIcon: {
      marginRight: spacing.margin.small,
    },
    leftIconStyle: {padding: 2, borderRadius: 6},
    marginRightIcon: {marginRight: spacing.margin.tiny},
    button: {
      marginLeft: spacing.margin.base,
    },
    rightText: {},
  });
};

export default BannerMessage;
