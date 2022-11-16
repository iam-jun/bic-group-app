import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import Icon from '~/baseComponents/Icon';
import spacing from '~/theme/spacing';
import Text from '~/beinComponents/Text';
import { CommunityPrivacyDetail, GroupPrivacyDetail, IPrivacyItem } from '~/constants/privacyTypes';
import InfoCard from '~/components/InfoCard';
import Divider from '~/beinComponents/Divider';

interface Props {
  id: string;
  name: string;
  description: string;
  privacy: string;
  canEditPrivacy: boolean;
  canEditInfo: boolean;
  type: 'community' | 'group';

  onPressPrivacy?: () => void;
}

const InfoView = ({
  id,
  name,
  description,
  privacy,
  canEditInfo,
  canEditPrivacy,
  type,
  onPressPrivacy,
}: Props) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();
  const { colors } = theme;
  const privacyScopeDetail = type === 'community' ? CommunityPrivacyDetail : GroupPrivacyDetail;
  const privacyItem: IPrivacyItem = privacyScopeDetail[privacy];

  const editDescription = () => {
    rootNavigation.navigate(
      groupStack.editDescription, { id, description, type },
    );
  };

  const editName = () => {
    rootNavigation.navigate(
      groupStack.editName, { id, name, type },
    );
  };

  const renderPrivacyView = () => (
    <>
      <View style={styles.privacyHeader}>
        <Icon icon={privacyItem.icon} tintColor={colors.neutral20} />
        <Text.BodyM color={colors.neutral60} style={styles.privacyText} useI18n>
          {privacyItem.title}
        </Text.BodyM>
      </View>

      <Text.BodyM style={styles.descriptionPrivacyText} color={colors.neutral60} useI18n>
        {privacyItem.subtitle}
      </Text.BodyM>
    </>
  );

  return (
    <View style={styles.container}>
      <InfoCard
        title={`settings:title_${type}_name`}
        onEdit={canEditInfo ? editName : undefined}
        style={styles.infoCard}
      >
        <Text.BodyM color={colors.neutral60}>{name}</Text.BodyM>
      </InfoCard>
      <Divider color={colors.gray5} size={spacing.padding.large} />

      <InfoCard
        title={`settings:title_${type}_description`}
        onEdit={canEditInfo ? editDescription : undefined}
        style={styles.infoCard}
      >
        <Text.BodyM color={colors.neutral60}>{description}</Text.BodyM>
      </InfoCard>
      <Divider color={colors.gray5} size={spacing.padding.large} />

      <InfoCard
        title="settings:title_privacy"
        onEdit={canEditPrivacy ? onPressPrivacy : undefined}
        style={styles.infoCard}
      >
        {renderPrivacyView()}
      </InfoCard>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    marginVertical: spacing.margin.large,
  },
  infoCard: {
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    marginHorizontal: spacing.margin.small,
  },
  descriptionPrivacyText: {
    marginTop: spacing.margin.base,
  },
});

export default InfoView;
