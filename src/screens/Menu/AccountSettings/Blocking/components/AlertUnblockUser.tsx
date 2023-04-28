import { t } from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';

const AlertUnblockUser = () => (
  <View testID="alert_unblock_user" style={styles.container}>
    <Text.BodyM useI18n>settings:text_unblock_user_name_result</Text.BodyM>
    <View style={styles.textContainer}>
      <Text.BodyM useI18n>{`• ${t('block_user:cannot:search_profile')}`}</Text.BodyM>
      <Text.BodyM useI18n>{`• ${t('block_user:cannot:mention')}`}</Text.BodyM>
      <Text.BodyM useI18n>{`• ${t('block_user:cannot:send_message')}`}</Text.BodyM>
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
    marginTop: spacing.margin.tiny,
  },
});

export default AlertUnblockUser;
