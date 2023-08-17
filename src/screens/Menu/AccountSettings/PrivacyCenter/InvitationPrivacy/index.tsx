import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { Radio, Button } from '~/baseComponents';
import usePersonalPrivacy from '../store';
import { INVITATION_PRIVACY_TYPE, INVITATION_PRIVACY_TYPES } from '~/constants/privacyCenter';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useRootNavigation } from '~/hooks/navigation';
import { USER_TABS } from '~/screens/Menu/UserProfile';
import { USER_TABS_TYPES } from '~/screens/Menu/UserProfile/constants';
import mainStack from '~/router/navigator/MainStack/stack';
import useCommonController from '~/screens/store';

interface IRadioItem {
    id: INVITATION_PRIVACY_TYPE;
    title: string;
    description: string;
}

const InvitationPrivacy = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const { rootNavigation } = useRootNavigation();

  const actions = usePersonalPrivacy((state) => state.actions);
  const invitationPrivacy = usePersonalPrivacy((state) => state.invitationPrivacy);
  const { id } = useCommonController((state) => state.myProfile) || {};

  useEffect(() => {
    actions.getPersonalPrivacySettings();
  }, []);

  const onChangeSetting = (item: IRadioItem) => {
    actions.editInvitationPrivacy(item.id);
  };

  const goToProfile = () => {
    const targetIndex = USER_TABS.findIndex(
      (item: { id: string; text: string }) => item.id === USER_TABS_TYPES.USER_INVITATIONS,
    );
    rootNavigation.navigate(mainStack.userProfile, { userId: id, targetIndex });
  };

  const renderRadioItem = (item: IRadioItem) => {
    const { id, title, description } = item;
    return (
      <View style={styles.radioItemContainer}>
        <Radio
          key={`invitation_privacy.raido_${id}`}
          testID="invitation_privacy.raido"
          isChecked={Boolean(invitationPrivacy === id)}
          onPress={() => onChangeSetting(item)}
          style={styles.radio}
        />
        <TouchableWithoutFeedback onPress={() => onChangeSetting(item)}>
          <View style={styles.radioItemTextContainer}>
            <Text.BodyMMedium useI18n color={colors.neutral80}>{title}</Text.BodyMMedium>
            <Text.BodyS useI18n color={colors.neutral40} style={styles.text}>
              {description}
            </Text.BodyS>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="invitation_privacy" isFullView>
      <Header title={t('settings:privacy_center:invitation_privacy:title')} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text.BodyS useI18n color={colors.neutral40}>
            settings:privacy_center:invitation_privacy:screen_description
          </Text.BodyS>
        </View>
        <View style={styles.optionsContainer}>
          <Divider />
          {renderRadioItem(INVITATION_PRIVACY_TYPES[0])}
          {renderRadioItem(INVITATION_PRIVACY_TYPES[1])}
          <ViewSpacing height={spacing.margin.large} />
          <Button onPress={goToProfile}>
            <Text.LinkS>
              {t('settings:privacy_center:invitation_privacy:view_all_inviations')}
            </Text.LinkS>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default InvitationPrivacy;

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
      backgroundColor: colors.white,
    },
    optionsContainer: {
      backgroundColor: colors.white,
      paddingBottom: spacing.padding.large,
      paddingHorizontal: spacing.padding.large,
    },
    radioItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.large,
    },
    radioItemTextContainer: {
      paddingHorizontal: spacing.padding.large,
    },
    radio: {
      alignSelf: 'center',
    },
    text: {
      flexShrink: 1,
    },
  });
};
