import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { InfoItem } from '../../components';
import EditButton from '../../components/EditButton';
import InfoCard from '~/components/InfoCard';
import { formatPhoneNumber } from '../../helper';
import mainStack from '~/router/navigator/MainStack/stack';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';

interface Props {
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  isCurrentUser: boolean;
}

const Contact = ({
  email,
  phone,
  countryCode,
  city,
  isCurrentUser,
}: Props) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const editContact = () => {
    rootNavigation.navigate(mainStack.editContact);
  };

  const BtnEditContact = (
    <EditButton
      isCurrentUser={isCurrentUser}
      onPress={editContact}
      icon="PenToSquareSolid"
      testID="contact.edit_btn"
    />
  );

  const isNothingToShow = Boolean(typeof city === 'undefined');

  return (
    <InfoCard
      testID="user_profile.contact"
      title="settings:title_contact"
      rightTitle={BtnEditContact}
      style={styles.container}
    >
      {isCurrentUser && (
        <>
          <InfoItem title="settings:title_email" value={email} />
          <InfoItem
            title="settings:title_phone_number"
            value={formatPhoneNumber(phone, countryCode)}
          />
        </>
      )}
      {
        isNothingToShow
          ? <Text.BodyM useI18n color={colors.neutral30}>settings:text_no_contact_to_show</Text.BodyM>
          : (
            <InfoItem
              title="settings:title_location"
              value={city}
              style={{ paddingBottom: 0 }}
            />
          )
      }
    </InfoCard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default Contact;
