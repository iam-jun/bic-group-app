import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import BasicInfo from '../BasicInfo';
import { spacing } from '~/theme';
import Divider from '~/beinComponents/Divider';
import Contact from '../Contact';
import Experiences from '../Experiences';
import useUserProfileStore from '../../store';

const UserInfo = ({ isCurrentUser }: {isCurrentUser: boolean}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const userProfileData = useUserProfileStore((state) => state.data);

  const {
    fullname,
    email,
    city,
    language,
    phone,
    countryCode,
    relationshipStatus,
    gender,
    birthday,
  } = userProfileData || {};

  return (
    <>
      <BasicInfo
        fullname={fullname}
        gender={gender}
        birthday={birthday}
        language={language}
        relationship={relationshipStatus}
        isCurrentUser={isCurrentUser}
      />
      <Divider color={colors.gray5} size={spacing.padding.large} />
      <Contact
        email={email}
        phone={phone}
        city={city}
        countryCode={countryCode}
        isCurrentUser={isCurrentUser}
      />
      <Experiences isCurrentUser={isCurrentUser} />
    </>
  );
};

export default UserInfo;
