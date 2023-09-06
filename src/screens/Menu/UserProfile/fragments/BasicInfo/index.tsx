import React from 'react';
import { StyleSheet } from 'react-native';
import genders from '~/constants/genders';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { useRootNavigation } from '~/hooks/navigation';
import { formatDate } from '~/utils/formatter';
import { InfoItem } from '../../components';
import EditButton from '../../components/EditButton';
import InfoCard from '~/components/InfoCard';
import { getLanguages } from '../../helper';
import mainStack from '~/router/navigator/MainStack/stack';
import { spacing } from '~/theme';

interface Props {
  fullname: string;
  gender: string;
  birthday: string;
  language: string[];
  relationship: string;
  isCurrentUser: boolean;
}

const BasicInfo = ({
  fullname,
  gender,
  birthday,
  language,
  relationship,
  isCurrentUser,
}: Props) => {
  const { rootNavigation } = useRootNavigation();
  // BE requests to clear timezone effect
  const birthdayWithoutTime = birthday?.substring(0, birthday?.indexOf('T'));
  const formattedBirthday = formatDate(birthdayWithoutTime, 'MMM D, YYYY');

  const editInfo = () => {
    rootNavigation.navigate(mainStack.editBasicInfo);
  };

  const BtnEditInfo = (
    <EditButton
      isCurrentUser={isCurrentUser}
      onPress={editInfo}
      icon="PenToSquareSolid"
      testID="basic_info.edit_btn"
    />
  );

  const shouldShowGender = !Boolean(typeof gender === 'undefined');
  const shouldShowRelationship = !Boolean(typeof relationship === 'undefined');
  const shouldShowLanguage = shouldShowGender && shouldShowRelationship;

  return (
    <InfoCard
      testID="user_profile.basic_info"
      title="settings:title_basic_info"
      rightTitle={BtnEditInfo}
      style={styles.container}
    >
      <InfoItem title="settings:title_name" value={fullname} />
      {shouldShowGender && <InfoItem title="settings:title_gender" value={genders[gender]} />}
      {isCurrentUser && (
        <InfoItem
          title="settings:title_birthday"
          value={formattedBirthday}
        />
      )}
      {shouldShowLanguage && (
      <InfoItem title="settings:title_language" value={getLanguages(language)} />
      )}
      {shouldShowRelationship && (
        <InfoItem
          title="settings:title_relationship_status"
          value={RELATIONSHIP_STATUS[relationship]}
          style={{ paddingBottom: 0 }}
        />
      )}
    </InfoCard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default BasicInfo;
