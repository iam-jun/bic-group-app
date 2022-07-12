import {View, StyleSheet} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import {useTheme} from 'react-native-paper';

import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import privacyTypes, {groupPrivacy} from '~/constants/privacyTypes';
import PreviewMembers from '../../components/PreviewMembers';
import groupJoinStatus from '~/constants/groupJoinStatus';

const AboutContent = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {description, user_count, privacy, join_status} = infoDetail;
  const privacyData = privacyTypes.find(item => item?.type === privacy) || {};
  const {icon: iconPrivacy, privacyTitle}: any = privacyData || {};
  const isMember = join_status === groupJoinStatus.member;

  return (
    <View style={styles.container} testID="about_content">
      {!!description && (
        <View style={styles.descriptionSection}>
          <Text.BodyM style={styles.titleDescription} useI18n>
            common:text_description
          </Text.BodyM>
          <CollapsibleText
            textProps={{variant: 'body'}}
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
        icon={'userGroup'}
        title={`${user_count} ${i18next.t('groups:text_members', {
          count: user_count,
        })}`}
        disabled
        rightSubIcon={
          isMember || privacy !== groupPrivacy.private
            ? 'AngleRightB'
            : undefined
        }
      />
      {(isMember || privacy !== groupPrivacy.private) && <PreviewMembers />}
    </View>
  );
};

export default AboutContent;

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: spacing.padding.large,
      paddingBottom: 80, // to avoid Join button at the bottom
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
