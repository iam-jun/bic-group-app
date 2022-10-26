import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import Divider from '~/beinComponents/Divider';
import SettingItem from '../../../EditBasicInfo/fragments/SettingItem';
import { useBaseHook } from '~/hooks';
import { spacing } from '~/theme';

interface Props {
  email: string;
  countryCode: string;
  phone: string;
  city: string;
  country: string;
  onPressEdit: () => void;
}

const Contact = ({
  email, countryCode, phone, city, country, onPressEdit,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { t } = useBaseHook();

  return (
    <View>
      <Divider style={styles.divider} />
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:title_contact
        </Text.BodyM>
        <ButtonWrapper onPress={onPressEdit}>
          <Text.H6
            testID="contact.edit"
            color={colors.neutral80}
            style={styles.editBtn}
            useI18n
          >
            settings:title_edit
          </Text.H6>
        </ButtonWrapper>
      </View>
      <View style={styles.infoItem}>
        <SettingItem
          title="settings:title_email"
          subtitle={email || t('common:text_not_set')}
          leftIcon="Envelope"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_phone_number"
          subtitle={
            countryCode && phone
              ? `(${countryCode}) ${phone}`
              : t('common:text_not_set')
          }
          leftIcon="Phone"
          isTouchDisabled
        />
        <SettingItem
          title="settings:title_location"
          subtitle={
            city && country
              ? `${city}, ${country}`
              : t('common:text_not_set')
          }
          leftIcon="LocationDot"
          isTouchDisabled
        />
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  divider: {
    marginVertical: spacing.margin.small,
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: spacing.padding.base,
    paddingVertical: spacing.padding.small,
    paddingLeft: spacing.padding.large,
    alignItems: 'center',
  },
  editBtn: { padding: spacing.padding.small },
  infoItem: {
    marginHorizontal: spacing.margin.tiny,
  },
});

export default Contact;
