import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import spacing from '~/theme/spacing';

interface NotificationInvitationButtonsProps {
  isLoadingAccept?: boolean;
  isLoadingDecline?: boolean;
  onAccept: (...params: any) => void;
  onDecline: (...params: any) => void;
}

const NotificationInvitationButtons = ({
  isLoadingAccept = false,
  isLoadingDecline = false,
  onAccept,
  onDecline,
}: NotificationInvitationButtonsProps) => (
  <View style={[styles.row, styles.buttonsContainer]}>
    <Button.Neutral
      testID="button_invitation.decline"
      useI18n
      type="solid"
      size="medium"
      loading={isLoadingDecline}
      disabled={isLoadingAccept}
      style={styles.button}
      onPress={onDecline}
    >
      common:btn_decline
    </Button.Neutral>
    <ViewSpacing width={spacing.margin.small} />
    <Button.Primary
      testID="button_invitation.accept"
      useI18n
      size="medium"
      loading={isLoadingAccept}
      disabled={isLoadingDecline}
      style={styles.button}
      onPress={onAccept}
    >
      common:btn_accept
    </Button.Primary>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  buttonsContainer: {
    paddingTop: spacing.padding.small,
    flex: 1,
  },
});

export default NotificationInvitationButtons;
