import { View, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import CollapsibleText from '~/baseComponents/Text/CollapsibleText';
import { GroupPrivacyDetail, GroupPrivacyType } from '~/constants/privacyTypes';
import spacing from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatter';
import { IPreviewMember } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import { Button } from '~/baseComponents';
import { IconType } from '~/resources/icons';
import Icon from '~/baseComponents/Icon';
import PreviewMembers from '../PreviewMembers';

type AboutContentProps = {
  profileInfo: {
    description?: string;
    userCount?: number;
    privacy?: GroupPrivacyType;
    members?: IPreviewMember[]
  };
  showPrivate?: boolean;
  onPressMember?: () => void;
}

export const CONTAINER_HORIZONTAL_PADDING = spacing.padding.large;

const AboutContent: FC<AboutContentProps> = ({ profileInfo, showPrivate, onPressMember }) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const {
    description, userCount, privacy, members,
  } = profileInfo;
  const privacyData = GroupPrivacyDetail[privacy] || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData;

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
  );
};

export default AboutContent;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
    },
    titleDescription: {
      marginBottom: spacing.margin.small,
    },
    descriptionSection: {
      marginVertical: spacing.margin.large,
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
