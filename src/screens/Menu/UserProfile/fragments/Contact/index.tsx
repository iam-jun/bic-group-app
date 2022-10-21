import React from 'react';
import { useRootNavigation } from '~/hooks/navigation';
import { InfoItem } from '../../components';
import EditButton from '../../components/EditButton';
import InfoSection from '../../components/InfoSection';
import { formatPhoneNumber } from '../../helper';
import mainStack from '~/router/navigator/MainStack/stack';

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

  const editContact = () => {
    rootNavigation.navigate(mainStack.editContact);
  };

  const BtnEditContact = (
    <EditButton
      isCurrentUser={isCurrentUser}
      onPress={editContact}
      icon="PenToSquareSolid"
    />
  );

  return (
    <InfoSection
      testID="user_profile.contact"
      title="settings:title_contact"
      rightTitle={BtnEditContact}
    >
      <InfoItem title="settings:title_email" value={email} />
      <InfoItem
        title="settings:title_phone_number"
        value={formatPhoneNumber(phone, countryCode)}
      />
      <InfoItem
        title="settings:title_location"
        value={city}
        style={{ paddingBottom: 0 }}
      />
    </InfoSection>
  );
};

export default Contact;
