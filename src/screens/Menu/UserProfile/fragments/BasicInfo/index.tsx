import React from 'react';
import genders from '~/constants/genders';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { formatDate } from '~/utils/formatData';
import { InfoItem } from '../../components';
import InfoSection from '../../components/InfoSection';
import { getLanguages } from '../../helper';

interface Props {
  fullname: string;
  gender: string;
  birthday: string;
  language: string[];
  relationship: string;
}

const BasicInfo = ({
  fullname, gender, birthday, language, relationship,
}: Props) => (
  <InfoSection testID="user_profile.basic_info" title="settings:title_basic_info">
    <InfoItem title="settings:title_name" value={fullname} />
    <InfoItem title="settings:title_gender" value={genders[gender]} />
    <InfoItem title="settings:title_birthday" value={formatDate(birthday, 'MMM D, YYYY')} />
    <InfoItem title="settings:title_language" value={getLanguages(language)} />
    <InfoItem title="settings:title_relationship_status" value={RELATIONSHIP_STATUS[relationship]} />
  </InfoSection>
);

export default BasicInfo;
