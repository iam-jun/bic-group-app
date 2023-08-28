import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import BasicInfo from '../BasicInfo';
import { spacing } from '~/theme';
import Divider from '~/beinComponents/Divider';
import Contact from '../Contact';
import Experiences from '../Experiences';
import useUserProfileStore from '../../store';
import useCommonController from '~/screens/store';

const UserInfo = ({ isCurrentUser }: {isCurrentUser: boolean}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const userProfileData = useUserProfileStore((state) => state.data);
  const myProfile = useCommonController((state) => state.myProfile);

  const {
    fullname: userFullname,
    email: userEmail,
    city: userCity,
    language: userLanguage,
    phone: userPhone,
    countryCode: userCountryCode,
    relationshipStatus: userRelationshipStatus,
    gender: userGender,
    birthday: userBirthday,
  } = userProfileData || {};

  const {
    fullname: myFullname,
    email: myEmail,
    city: myCity,
    language: myLanguage,
    phone: myPhone,
    countryCode: myCountryCode,
    relationshipStatus: myRelationshipStatus,
    gender: myGender,
    birthday: myBirthday,
  } = myProfile || {};

  const fullname = isCurrentUser ? myFullname : userFullname;
  const email = isCurrentUser ? myEmail : userEmail;
  const city = isCurrentUser ? myCity : userCity;
  const language = isCurrentUser ? myLanguage : userLanguage;
  const phone = isCurrentUser ? myPhone : userPhone;
  const countryCode = isCurrentUser ? myCountryCode : userCountryCode;
  const relationshipStatus = isCurrentUser ? myRelationshipStatus : userRelationshipStatus;
  const gender = isCurrentUser ? myGender : userGender;
  const birthday = isCurrentUser ? myBirthday : userBirthday;

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
