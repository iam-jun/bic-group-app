import React from 'react';
import { InfoItem } from '../../components';
import InfoSection from '../../components/InfoSection';
import { formatPhoneNumber } from '../../helper';

interface Props {
  email: string;
  phone: string;
  countryCode: string;
  city: string;
}

const Contact = ({
  email, phone, countryCode, city,
}: Props) => (
  <InfoSection testID="user_profile.contact" title="settings:title_contact">
    <InfoItem title="settings:title_email" value={email} />
    <InfoItem title="settings:title_phone_number" value={formatPhoneNumber(phone, countryCode)} />
    <InfoItem
      title="settings:title_location"
      value={city}
    />
  </InfoSection>
)

export default Contact;
