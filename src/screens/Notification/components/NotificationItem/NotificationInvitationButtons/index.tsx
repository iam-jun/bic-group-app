import React from 'react';
import {
  StyleProp,
  StyleSheet, View, ViewStyle,
} from 'react-native';
import { Button } from '~/baseComponents';
import { ButtonSize } from '~/baseComponents/Button/interface';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import spacing from '~/theme/spacing';

interface NotificationInvitationButtonsProps {
  isLoadingAccept?: boolean;
  isLoadingDecline?: boolean;
  style?: StyleProp<ViewStyle>;
  styleButton?: StyleProp<ViewStyle>;
  size?: ButtonSize;
  onAccept: (...params: any) => void;
  onDecline: (...params: any) => void;
}

const NotificationInvitationButtons = ({
  isLoadingAccept = false,
  isLoadingDecline = false,
  style,
  size = 'medium',
  styleButton,
  onAccept,
  onDecline,
}: NotificationInvitationButtonsProps) => (
  <View style={[styles.row, styles.buttonsContainer, style]}>
    <Button.Neutral
      testID="button_invitation.decline"
      useI18n
      type="solid"
      size={size}
      loading={isLoadingDecline}
      disabled={isLoadingAccept}
      style={[styles.button, styleButton]}
      onPress={onDecline}
    >
      common:btn_decline
    </Button.Neutral>
    <ViewSpacing width={spacing.margin.small} />
    <Button.Primary
      testID="button_invitation.accept"
      useI18n
      size={size}
      loading={isLoadingAccept}
      disabled={isLoadingDecline}
      style={[styles.button, styleButton]}
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
