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
  const theme: ITheme = useTheme() as ITheme;
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
          tintColor={colors.iconTintReversed}
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
  theme: ITheme,
  type: 'success' | 'error' | 'informative',
) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      alignSelf: 'baseline',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D0D5DD',
      borderRadius: 2,

      shadowColor: '#000',
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
          ? colors.error
          : colors.background,
    },
    marginRightIcon: {marginRight: spacing.margin.tiny},
    button: {
      marginLeft: spacing.margin.base,
    },
    rightText: {},
  });
};

export default BannerMessage;
