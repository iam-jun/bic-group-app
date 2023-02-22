import React from 'react';
import { StyleSheet } from 'react-native';
import genders from '~/constants/genders';
import RELATIONSHIP_STATUS from '~/constants/relationshipStatus';
import { useRootNavigation } from '~/hooks/navigation';
import { formatDate } from '~/utils/formatData';
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

  return (
    <InfoCard
      testID="user_profile.basic_info"
      title="settings:title_basic_info"
      rightTitle={BtnEditInfo}
      style={styles.container}
    >
      <InfoItem title="settings:title_name" value={fullname} />
      <InfoItem title="settings:title_gender" value={genders[gender]} />
      <InfoItem
        title="settings:title_birthday"
        value={formatDate(birthday, 'MMM D, YYYY')}
      />
      <InfoItem title="settings:title_language" value={getLanguages(language)} />
      <InfoItem
        title="settings:title_relationship_status"
        value={RELATIONSHIP_STATUS[relationship]}
        style={{ paddingBottom: 0 }}
      />
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
