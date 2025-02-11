import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Header from '~/beinComponents/Header';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { Button, ScreenWrapper } from '~/baseComponents';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

const PrivacyCenter = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const { rootNavigation } = useRootNavigation();

  const goToPersonalInfoVisibility = () => {
    rootNavigation.navigate(menuStack.personalInfoVisibility);
  };

  const goToInvitationPrivacy = () => {
    rootNavigation.navigate(menuStack.invitationPrivacy);
  };

  const renderItem = (
    title: string,
    testID: string,
    onPress: () => void,
  ) => (
    <Button
      testID={testID}
      style={styles.settingRow}
      onPress={onPress}
    >
      <Text.BodyMMedium useI18n color={colors.neutral80}>
        {title}
        {' '}
        settings:privacy_center:personal_information_visibility:title
      </Text.BodyMMedium>
      <Icon
        size={16}
        icon="ChevronRight"
      />
    </Button>
  );

  return (
    <ScreenWrapper testID="privacy_center" isFullView>
      <Header title={t('settings:privacy_center:screen_title')} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text.BodyS useI18n color={colors.neutral40}>
            settings:privacy_center:screen_description
          </Text.BodyS>
        </View>
        {renderItem(
          'settings:privacy_center:invitation_privacy:title',
          'privacy_center.invitation_privacy',
          goToInvitationPrivacy,
        )}
        {renderItem(
          'settings:privacy_center:personal_information_visibility:title',
          'privacy_center.personal_information_visibility',
          goToPersonalInfoVisibility,
        )}
      </View>
    </ScreenWrapper>
  );
};

export default PrivacyCenter;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    headerContainer: {
      paddingVertical: spacing.margin.base,
      paddingHorizontal: spacing.padding.large,
      marginTop: spacing.margin.large,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral5,
      backgroundColor: colors.white,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
  });
};
