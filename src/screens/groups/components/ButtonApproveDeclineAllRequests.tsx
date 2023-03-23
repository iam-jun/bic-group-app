import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Divider from '~/beinComponents/Divider';
import { Button } from '~/baseComponents';

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
    <View style={[styles.container, style]} testID="button_approve_decline_all_requests">
      <Divider />
      <View style={styles.buttons}>
        <Button.Neutral
          testID="button_approve_decline_all_requests.decline"
          style={styles.buttonDecline}
          type="solid"
          size="medium"
          icon="CircleMinusSolid"
          onPress={onPressDeclineAll}
          useI18n
        >
          common:btn_decline_all
        </Button.Neutral>
        <Button.Primary
          testID="button_approve_decline_all_requests.approve"
          style={styles.buttonApprove}
          type="solid"
          size="medium"
          icon="CircleCheckSolid"
          onPress={onPressApproveAll}
          useI18n
        >
          common:btn_approve_all
        </Button.Primary>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    buttons: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.extraLarge,
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
