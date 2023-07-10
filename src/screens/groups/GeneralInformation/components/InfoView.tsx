import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import Icon from '~/baseComponents/Icon';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import {
  CommunityPrivacyDetail, CommunityPrivacyType, GroupPrivacyDetail, GroupPrivacyType, IPrivacyItem,
} from '~/constants/privacyTypes';
import InfoCard from '~/components/InfoCard';
import Divider from '~/beinComponents/Divider';

interface Props {
  id: string;
  name: string;
  description: string;
  privacy: CommunityPrivacyType | GroupPrivacyType;
  canEditPrivacy: boolean;
  canEditInfo: boolean;
  type: 'community' | 'group';
  rootGroupId: string;
}

const InfoView = ({
  id,
  name,
  description,
  privacy,
  canEditInfo,
  canEditPrivacy,
  type,
  rootGroupId,
}: Props) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const privacyScopeDetail = type === 'community' ? CommunityPrivacyDetail : GroupPrivacyDetail;
  const privacyItem: IPrivacyItem = privacyScopeDetail[privacy];
  const { icon, title, subtitle } = privacyItem || {};

  const isPrivatePrivacy = privacy === CommunityPrivacyType.PRIVATE
  || privacy === GroupPrivacyType.PRIVATE;

  const isSecretPrivacy = privacy === GroupPrivacyType.SECRET;

  const onPressEditDescription = () => {
    rootNavigation.navigate(
      groupStack.editDescription, {
        id, description, type, rootGroupId,
      },
    );
  };

  const onPressEditName = () => {
    rootNavigation.navigate(
      groupStack.editName, {
        id, name, type, rootGroupId,
      },
    );
  };

  const onPressEditPrivacy = () => {
    rootNavigation.navigate(
      groupStack.editPrivacy, {
        id, privacy, type, rootGroupId,
      },
    );
  };

  const renderPrivacyView = () => (
    <>
      <View style={styles.privacyHeader}>
        <Icon icon={icon} tintColor={colors.neutral20} />
        <Text.BodyM
          testID="info_view.privacy_type"
          color={colors.neutral60}
          style={styles.privacyText}
          useI18n
        >
          {title}
        </Text.BodyM>
      </View>

      <Text.BodyM
        testID="info_view.privacy_description"
        style={styles.descriptionPrivacyText}
        color={colors.neutral60}
        useI18n
      >
        {subtitle}
      </Text.BodyM>

      {isSecretPrivacy && (
        <View style={styles.privacyBannerView} testID="info_view.secret_banner_view">
          <Icon icon="CircleInfo" tintColor={colors.neutral20} size={18} />
          <Text.BodyS style={styles.bannerText} color={colors.neutral40} useI18n>
            {`settings:text_secret_${type}_banner_message`}
          </Text.BodyS>
        </View>
      )}

      {isPrivatePrivacy && (
        <View style={styles.privacyBannerView} testID="info_view.private_banner_view">
          <Icon icon="CircleInfo" tintColor={colors.neutral20} size={18} />
          <Text.BodyS style={styles.bannerText} color={colors.neutral40} useI18n>
            {`settings:text_private_${type}_banner_message`}
          </Text.BodyS>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <InfoCard
        title={`settings:title_${type}_name`}
        onEdit={canEditInfo ? onPressEditName : undefined}
        style={styles.infoCard}
      >
        <Text.BodyM
          testID="info_view.name"
          color={colors.neutral60}
        >
          {name}
        </Text.BodyM>
      </InfoCard>
      <Divider color={colors.gray5} size={spacing.padding.large} />

      <InfoCard
        title={`settings:title_${type}_description`}
        onEdit={canEditInfo ? onPressEditDescription : undefined}
        style={styles.infoCard}
      >
        <Text.BodyM
          testID="info_view.description"
          color={colors.neutral60}
        >
          {description}
        </Text.BodyM>
      </InfoCard>
      <Divider color={colors.gray5} size={spacing.padding.large} />

      <InfoCard
        title="settings:title_privacy"
        onEdit={canEditPrivacy ? onPressEditPrivacy : undefined}
      >
        {renderPrivacyView()}
      </InfoCard>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
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
      marginHorizontal: spacing.margin.large,
    },
    privacyText: {
      marginHorizontal: spacing.margin.small,
    },
    descriptionPrivacyText: {
      marginTop: spacing.margin.base,
      marginHorizontal: spacing.margin.large,
      marginBottom: spacing.margin.large,
    },
    privacyBannerView: {
      flexDirection: 'row',
      backgroundColor: colors.gray1,
      marginBottom: spacing.margin.large,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    bannerText: {
      flex: 1,
      marginHorizontal: spacing.margin.small,
    },
  });
};

export default InfoView;
