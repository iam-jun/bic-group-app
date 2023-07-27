import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { t } from 'i18next';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import { Radio } from '~/baseComponents';
import useVisibilityPrivacyStore from '../store';
import { PERSONAL_INFORMATION_VISIBILITY_TYPE, PERSONAL_INFORMATION_VISIBILITY_TYPES } from '~/constants/privacyCenter';
import Divider from '~/beinComponents/Divider';

interface IRadioItem {
    id: PERSONAL_INFORMATION_VISIBILITY_TYPE;
    title: string;
    description: string;
}

const PersonalInfoVisibility = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const actions = useVisibilityPrivacyStore((state) => state.actions);
  const visibilityPrivacy = useVisibilityPrivacyStore((state) => state.visibilityPrivacy);

  useEffect(() => {
    actions.getPersonalInfoVisibility();
  }, []);

  const onChangeSetting = (item: IRadioItem) => {
    actions.editPersonalInfoVisibility(item.id);
  };

  const renderRadioItem = (item: IRadioItem) => {
    const { id, title, description } = item;
    return (
      <View style={styles.radioItemContainer}>
        <Radio
          key={`personal_info_visibility.raido_${id}`}
          testID="personal_info_visibility.raido"
          isChecked={Boolean(visibilityPrivacy === id)}
          onPress={() => onChangeSetting(item)}
          style={styles.radio}
        />
        <TouchableWithoutFeedback onPress={() => onChangeSetting(item)}>
          <View style={styles.radioItemTextContainer}>
            <Text.BodyMMedium useI18n color={colors.neutral80}>{title}</Text.BodyMMedium>
            <Text.BodyS useI18n color={colors.neutral40}>{description}</Text.BodyS>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="blocking" isFullView>
      <Header title={t('settings:privacy_center:personal_information_visibility:title')} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text.BodyS useI18n color={colors.neutral40}>
            settings:privacy_center:personal_information_visibility:description
          </Text.BodyS>
        </View>
        <View style={styles.optionsContainer}>
          <Divider />
          {renderRadioItem(PERSONAL_INFORMATION_VISIBILITY_TYPES[0])}
          {renderRadioItem(PERSONAL_INFORMATION_VISIBILITY_TYPES[1])}
          {renderRadioItem(PERSONAL_INFORMATION_VISIBILITY_TYPES[2])}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PersonalInfoVisibility;

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
      paddingLeft: spacing.padding.large,
    },
    radio: {
      alignSelf: 'center',
    },
  });
};
