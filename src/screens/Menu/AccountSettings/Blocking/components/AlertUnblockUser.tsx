import { t } from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';

const AlertUnblockUser = () => (
  <View testID="alert_unblock_user" style={styles.container}>
    <Text.BodyM useI18n>settings:text_unblock_user_name_result</Text.BodyM>
    <View style={styles.textContainer}>
      <Text.BodyM useI18n>{`• ${t('settings:text_unblock_user_name_result_a')}`}</Text.BodyM>
      <Text.BodyM useI18n>{`• ${t('settings:text_unblock_user_name_result_b')}`}</Text.BodyM>
      <Text.BodyM useI18n>{`• ${t('settings:text_unblock_user_name_result_c')}`}</Text.BodyM>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
  },
  textContainer: {
    paddingLeft: spacing.padding.small,
    marginTop: spacing.margin.base,
  },
});

export default AlertUnblockUser;
