import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Image from '~/beinComponents/Image';
import Icon from '~/baseComponents/Icon';
import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import images from '~/resources/images';
import dimension, { scaleCoverHeight } from '~/theme/dimension';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { ICommunity } from '~/interfaces/ICommunity';
import { IGroup } from '~/interfaces/IGroup';

interface InfoHeaderProps {
  infoDetail: ICommunity | IGroup;
  isMember: boolean;
  insideCommunityName?: string;
  onPressGroupTree?: () => void
}

const InfoHeader = ({
  infoDetail, isMember, insideCommunityName, onPressGroupTree,
}: InfoHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const {
    name, userCount, backgroundImgUrl, icon, privacy,
  } = infoDetail;
  const privacyData = groupPrivacyListDetail.find((item) => item?.type === privacy) || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData || {};

  const renderCoverAvatar = () => (
    <View testID="info_header.cover" style={styles.coverAvatarContainer}>
      <Image
        style={styles.cover}
        source={backgroundImgUrl || images.img_cover_default}
      />
      <Avatar.Large
        showBorder
        source={icon || images.img_user_avatar_default}
        style={styles.avatar}
      />
    </View>
  );

  const renderCommunityText = () => (
    !!insideCommunityName && (
      <View style={styles.communityText}>
        <Text.SubtitleXS color={theme.colors.blue50} numberOfLines={1}>
          {insideCommunityName}
        </Text.SubtitleXS>
      </View>
    )
  );

  const renderInfoHeader = () => (
    <View style={styles.infoContainer}>
      <View style={styles.flex1}>
        <Text.H4 numberOfLines={2} color={theme.colors.neutral80} testID="info_header.name">{name}</Text.H4>
        <View style={styles.infoLine}>
          <View style={styles.info}>
            <Icon
              icon={iconPrivacy}
              size={16}
              tintColor={theme.colors.neutral40}
            />
            <Text.BodySMedium
              style={styles.privacyText}
              color={theme.colors.neutral40}
              testID="info_header.privacy"
            >
              {t(privacyTitle)}
            </Text.BodySMedium>
            <Text.BodySMedium
              style={styles.memberCount}
              color={theme.colors.neutral40}
              testID="info_header.member_count"
            >
              {userCount}
            </Text.BodySMedium>
            <Text.BodyS color={theme.colors.neutral40}>
              {`${t('groups:title_members', {
                count: userCount,
              })}`}
            </Text.BodyS>
          </View>
          {isMember && (
            <Button.Secondary
              useI18n
              color={theme.colors.blue2}
              textColor={theme.colors.blue50}
              borderRadius={spacing.borderRadius.base}
              textVariant="buttonS"
              testID="page_content.your_groups_btn"
              onPress={onPressGroupTree}
            >
              groups:group_content:btn_group_tree
            </Button.Secondary>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View testID="info_header">
      {renderCoverAvatar()}
      {renderCommunityText()}
      {renderInfoHeader()}
    </View>
  );
};

export default InfoHeader;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    coverAvatarContainer: {
      paddingBottom: spacing.padding.large,
      backgroundColor: colors.white,
    },
    cover: {
      width: dimension.deviceWidth,
      height: scaleCoverHeight(),
    },
    avatar: {
      position: 'absolute',
      bottom: 0,
      left: 19,
    },
    communityText: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.margin.large,
      paddingTop: spacing.margin.small,
    },
    flex1: { flex: 1 },
    infoContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.small,
    },
    infoLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.margin.small,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    privacyText: {
      marginLeft: spacing.margin.small,
    },
    memberCount: {
      marginLeft: 40,
      marginRight: spacing.margin.tiny,
    },
  });
};
