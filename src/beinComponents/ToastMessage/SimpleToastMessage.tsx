import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Icon from '~/beinComponents/Icon';

import Text, { TextProps } from '~/beinComponents/Text';
import { IconType } from '~/resources/icons';
import { clearToastMessage } from '~/store/modal/actions';
import spacing from '~/theme/spacing';

interface SimpleToastMessageProps {
  children?: React.ReactNode;
  textProps?: TextProps;
  icon?: IconType;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
  disabled?: boolean;
}

const SimpleToastMessage: React.FC<SimpleToastMessageProps> = ({
  children,
  textProps,
  icon,
  style,
  onActionPress,
  disabled,
}: SimpleToastMessageProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const _onPress = () => {
    onActionPress?.();
    dispatch(clearToastMessage());
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={_onPress}
      testID="simple_toast_message"
    >
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Text.BodyS
          {...textProps}
          color={theme.colors.purple60}
          testID="simple_toast_message.children"
        >
          {children}
        </Text.BodyS>
        {!!icon && (
          <Icon
            icon={icon}
            size={24}
            tintColor={theme.colors.purple60}
            testID="simple_toast_message.icon"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      borderWidth: 1,
      borderRadius: 22,
      borderColor: colors.purple10,
      alignSelf: 'baseline',
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10.32,
      elevation: 16,
    },
  });
};

export default SimpleToastMessage;
