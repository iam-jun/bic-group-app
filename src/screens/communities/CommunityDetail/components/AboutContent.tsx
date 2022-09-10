import { View, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import i18next from 'i18next';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import PreviewMembers from './PreviewMembers';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { formatLargeNumber } from '~/utils/formatData';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupJoinStatus from '~/constants/groupJoinStatus';

type AboutContentProps = {
  showPrivate?: boolean;
}

const AboutContent: FC<AboutContentProps> = ({ showPrivate }) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    description, userCount, privacy, id, joinStatus,
  } = infoDetail;
  const privacyData
    = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData || {};
  const isMember = joinStatus === groupJoinStatus.member;

  const renderDescription = () => {
    if (!description) return null;

    return (
      <View style={styles.descriptionSection}>
        <Text.SubtitleL style={styles.titleDescription} useI18n>
          common:text_description
        </Text.SubtitleL>
        <CollapsibleText
          textProps={{ variant: 'paragraphM' }}
          content={description}
        />
      </View>
    );
  };

  const onPressTotalMember = () => {
    rootNavigation.navigate(groupStack.communityMembers, { communityId: id, isMember });
  };

  if (showPrivate) {
    return (
      <View testID="about_content" style={styles.container}>
        {renderDescription()}
      </View>
    );
  }

  return (
    <View style={styles.wapper}>
      <ViewSpacing height={spacing.padding.large} />
      <View style={styles.container} testID="about_content">
        {renderDescription()}
        <MenuItem
          testID="about_content.privacy"
          icon={iconPrivacy}
          title={i18next.t(privacyTitle)}
          disabled
          iconProps={{ tintColor: colors.neutral20, size: 16 }}
        />
        <MenuItem
          testID="about_content.members"
          icon="UserGroupSolid"
          title={`${formatLargeNumber(userCount)} ${i18next.t('groups:text_members', {
            count: userCount,
          })}`}
          onPress={onPressTotalMember}
          iconProps={{ tintColor: colors.neutral20, size: 18 }}
          rightSubIcon="AngleRightSolid"
        />
        <PreviewMembers />
      </View>
    </View>
  );
};

export default AboutContent;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wapper: {
      flex: 1,
      backgroundColor: colors.neutral5,
    },
    container: {
      backgroundColor: colors.white,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.large,
    },
    titleDescription: {
      marginBottom: spacing.margin.small,
    },
    descriptionSection: {
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
  });
};
