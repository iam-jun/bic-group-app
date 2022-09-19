import { View, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import { groupPrivacyListDetail, GROUP_PRIVACY_TYPE } from '~/constants/privacyTypes';
import PreviewMembers from './PreviewMembers';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { formatLargeNumber } from '~/utils/formatData';
import { useBaseHook } from '~/hooks';
import { Button } from '~/baseComponents';
import { IconType } from '~/resources/icons';
import Icon from '~/baseComponents/Icon';
import { IPreviewMember } from '~/interfaces/ICommunity';

type AboutContentProps = {
  profileInfo: {
    description: string;
    userCount?: number;
    privacy?: GROUP_PRIVACY_TYPE;
    members?: IPreviewMember[]
  };
  showPrivate?: boolean;
  onPressMember?: () => void;
}

const AboutContent: FC<AboutContentProps> = ({ profileInfo, showPrivate, onPressMember }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;
  const { t } = useBaseHook();

  const {
    description, userCount, privacy, members,
  } = profileInfo;
  const privacyData
    = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData || {};

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

  if (showPrivate) {
    return (
      <View testID="about_content" style={styles.container}>
        {renderDescription()}
      </View>
    );
  }

  const renderItem = ({
    leftIcon,
    content,
    testID,
    rightIcon,
    onPress,
  }: {
    leftIcon: IconType;
    content: string;
    testID?: string;
    rightIcon?: IconType;
    onPress?: () => void;
  }) => (
    <Button disabled={!onPress} style={styles.itemContainer} onPress={onPress} testID={testID}>
      <Icon icon={leftIcon} size={18} tintColor={colors.neutral20} />
      <Text.BodySMedium color={colors.neutral40} style={styles.itemContentText} useI18n>
        {content}
      </Text.BodySMedium>
      {!!rightIcon && <Icon icon={rightIcon} size={12} tintColor={colors.neutral40} />}
    </Button>
  );

  return (
    <View style={styles.wapper}>
      <ViewSpacing height={spacing.padding.large} />
      <View style={styles.container} testID="about_content">
        {renderDescription()}
        {renderItem({
          testID: 'about_content.privacy',
          leftIcon: iconPrivacy,
          content: t(privacyTitle),
        })}
        {renderItem({
          testID: 'about_content.members',
          leftIcon: 'UserGroupSolid',
          content: `${formatLargeNumber(userCount)}`,
          rightIcon: 'AngleRightSolid',
          onPress: onPressMember,
        })}
        <PreviewMembers userCount={userCount} members={members} />
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
      paddingHorizontal: spacing.padding.large,
    },
    titleDescription: {
      marginBottom: spacing.margin.small,
    },
    descriptionSection: {
      marginBottom: spacing.margin.large,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.padding.base,
    },
    itemContentText: {
      marginHorizontal: spacing.margin.small,
      flex: 1,
    },
  });
};
