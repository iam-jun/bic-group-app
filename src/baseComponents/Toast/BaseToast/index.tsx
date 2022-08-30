import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { IconType } from '~/resources/icons';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import Icon from '../../Icon';
import Button from '../../Button';
import modalActions from '~/storeRedux/modal/actions';

export interface BaseToastProps {
  style?: StyleProp<ViewStyle>;
  icon?: IconType;
  iconColor?: string;
  content?: string;
  useI18n?: boolean;
  buttonText?: string;
  isError?: boolean;
  onButtonPress?: () => void;
  onPressClose?: () => void;
}

const BaseToast = ({
  style,
  icon,
  iconColor,
  content,
  useI18n,
  buttonText,
  isError,
  onButtonPress,
  onPressClose,
}: BaseToastProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const iconProps = isError
    ? { icon: 'CircleExclamationSolid' as IconType, tintColor: colors.red40 }
    : { icon, tintColor: iconColor || colors.neutral20 };

  const _onPress = () => {
    onButtonPress?.();
  };

  const _onPressClose = () => {
    onPressClose?.();
    dispatch(modalActions.clearToastMessage());
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {!!iconProps.icon && (
          <Icon
            size={20}
            iconStyle={styles.iconStyle}
            {...iconProps}
          />
        )}
        <Text.BodyM color={colors.white} useI18n={useI18n}>{content}</Text.BodyM>
      </View>

      <View style={styles.rightContainer}>
        {!!buttonText && (
          <Button style={styles.actionButton} onPress={_onPress}>
            <Text.ButtonS useI18n={useI18n}>{buttonText}</Text.ButtonS>
          </Button>
        )}
        <Icon icon="iconClose" size={12} tintColor={colors.neutral20} onPress={_onPressClose} />
      </View>
    </View>
  );
};

export default BaseToast;

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral80,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      marginHorizontal: spacing.margin.large,
      borderRadius: spacing.borderRadius.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...elevations.e3,
    },
    leftContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      marginRight: spacing.margin.small,
    },
    rightContainer: {
      paddingLeft: spacing.margin.base,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      backgroundColor: colors.neutral2,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.base,
      marginRight: spacing.margin.large,
    },
  });
};
