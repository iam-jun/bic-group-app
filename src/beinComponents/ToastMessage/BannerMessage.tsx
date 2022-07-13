import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Icon from '~/beinComponents/Icon';
import Text, {TextProps} from '~/beinComponents/Text';
import {IconType} from '~/resources/icons';
import Button from '~/beinComponents/Button';
import spacing from '~/theme/spacing';

export interface BannerMessageProps {
  type?: 'error' | 'success' | 'informative';
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
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme, type);

  const _onPress = () => {
    onActionPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, style]}
      onPress={_onPress}>
      {leftIcon && (
        <Icon
          isButton
          iconStyle={[styles.leftIconStyle]}
          style={styles.leftIcon}
          icon={leftIcon}
          tintColor={colors.white}
        />
      )}

      <View style={styles.textContainer}>
        <View style={styles.childrenStyle}>
          <Text.Body {...textProps} style={styles.descriptionText}>
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

const createStyle = (
  theme: ExtendedTheme,
  type: 'success' | 'error' | 'informative',
) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      alignSelf: 'baseline',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray5,
      borderRadius: 2,

      shadowColor: colors.neutral90,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
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
    leftIconStyle: {
      padding: spacing.padding.tiny,
      borderRadius: 4,
      backgroundColor:
        type === 'success'
          ? colors.success
          : type === 'error'
          ? colors.red60
          : colors.white,
    },
    marginRightIcon: {marginRight: spacing.margin.tiny},
    button: {
      marginLeft: spacing.margin.base,
    },
    rightText: {},
  });
};

export default BannerMessage;
