import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Divider from '~/beinComponents/Divider';
import Button from '~/beinComponents/Button';

import spacing from '~/theme/spacing';

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  onPressDeclineAll: () => void;
  onPressApproveAll: () => void;
}

const ButtonApproveDeclineAllRequests = ({
  style,
  onPressDeclineAll,
  onPressApproveAll,
}: ButtonProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Divider />
      <View style={styles.buttons}>
        <Button.Secondary
          testID="button_approve_decline_all_requests.decline"
          style={styles.buttonDecline}
          color={theme.colors.gray40}
          textColor={theme.colors.neutral80}
          onPress={onPressDeclineAll}
          useI18n>
          common:btn_decline_all
        </Button.Secondary>
        <Button.Secondary
          highEmphasis
          testID="button_approve_decline_all_requests.approve"
          style={styles.buttonApprove}
          color={theme.colors.purple50}
          onPress={onPressApproveAll}
          useI18n>
          common:btn_approve_all
        </Button.Secondary>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    buttons: {
      flexDirection: 'row',
      margin: spacing.margin.large,
    },
    buttonDecline: {
      flex: 1,
      marginRight: spacing.margin.small,
    },
    buttonApprove: {
      flex: 1,
    },
  });
};

export default ButtonApproveDeclineAllRequests;
