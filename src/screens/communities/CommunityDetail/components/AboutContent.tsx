import { View, StyleSheet } from 'react-native';
import React from 'react';
import i18next from 'i18next';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import { groupPrivacyListDetail, groupPrivacy } from '~/constants/privacyTypes';
import PreviewMembers from '../../../groups/components/PreviewMembers';
import groupJoinStatus from '~/constants/groupJoinStatus';
import spacing from '~/theme/spacing';

const AboutContent = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    description, userCount, privacy, joinStatus,
  } = infoDetail;
  const privacyData = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData || {};
  const isMember = joinStatus === groupJoinStatus.member;

  return (
    <View style={styles.container} testID="about_content">
      {!!description && (
        <View style={styles.descriptionSection}>
          <Text.ButtonM style={styles.titleDescription} useI18n>
            common:text_description
          </Text.ButtonM>
          <CollapsibleText
            textProps={{ variant: 'bodyM' }}
            content={description}
          />
        </View>
      )}

      <MenuItem
        testID="about_content.privacy"
        icon={iconPrivacy}
        title={i18next.t(privacyTitle)}
        disabled
      />
      <MenuItem
        testID="about_content.members"
        icon="UserGroup"
        title={`${userCount} ${i18next.t('groups:text_members', {
          count: userCount,
        })}`}
        disabled
        rightSubIcon={
          isMember || privacy !== groupPrivacy.private
            ? 'AngleRightSolid'
            : undefined
        }
      />
      {(isMember || privacy !== groupPrivacy.private) && <PreviewMembers />}
    </View>
  );
};

export default AboutContent;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.large,
      paddingBottom: 100, // to avoid Join button at the bottom
    },
    titleDescription: {
      marginBottom: spacing.margin.large,
    },
    descriptionSection: {
      paddingHorizontal: spacing.padding.large,
      marginVertical: spacing.margin.base,
    },
  });
};
