import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import Divider from './Divider';
import Button from './Button';
import {ITheme} from '~/theme/interfaces';

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
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Divider />
      <View style={styles.buttons}>
        <Button.Secondary
          testID="pending_action_all.btn_decline_all"
          style={styles.buttonDecline}
          color={theme.colors.primary1}
          onPress={onPressDeclineAll}
          useI18n>
          common:btn_decline_all
        </Button.Secondary>
        <Button.Secondary
          highEmphasis
          testID="pending_action_all.btn_approve_all"
          style={styles.buttonApprove}
          color={theme.colors.primary6}
          onPress={onPressApproveAll}
          useI18n>
          common:btn_approve_all
        </Button.Secondary>
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
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
