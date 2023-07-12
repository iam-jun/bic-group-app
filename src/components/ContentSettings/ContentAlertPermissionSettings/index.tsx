import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

type ContentAlertPermissionSettingsProps = {
    audienceListNames: string;
}

const ContentAlertPermissionSettings: FC<ContentAlertPermissionSettingsProps> = ({ audienceListNames }) => {
  const { t } = useBaseHook();

  return (
    <Text.BodyM style={styles.childrenText}>
      {t('post:post_setting_permissions_alert:description_1')}
      <Text.BodyMMedium>{audienceListNames}</Text.BodyMMedium>
      {t('post:post_setting_permissions_alert:description_2')}
    </Text.BodyM>
  );
};

const styles = StyleSheet.create({
  childrenText: {
    paddingTop: spacing.padding.tiny,
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});

export default ContentAlertPermissionSettings;
