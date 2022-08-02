import React from 'react';
import { InfoItem } from '../components';
import InfoSection from '../components/InfoSection';

interface Props {
    email: string;
    phone: string;
    city: string;
    country: string;
}

const Contact = ({
  email, phone, city, country,
}: Props) => (
  <InfoSection title="settings:title_contact">
    <InfoItem title="settings:title_email" value={email} />
    <InfoItem title="settings:title_phone_number" value={phone} />
    <InfoItem
      title="settings:title_location"
      value={city && country ? `${city}, ${country}` : undefined}
    />
  </InfoSection>
)

export default Contact;
