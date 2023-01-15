import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Avatar from '~/baseComponents/Avatar';
import Text from '~/baseComponents/Text';
import images from '~/resources/images';
import dimension, { scaleCoverHeight } from '~/theme/dimension';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import { ICommunity } from '~/interfaces/ICommunity';
import { IGroup } from '~/interfaces/IGroup';
import { formatLargeNumber } from '~/utils/formatData';
import Image from '~/beinComponents/Image';

interface InfoHeaderProps {
  infoDetail: ICommunity | IGroup;
  insideCommunityName?: string;
}

const _InfoHeader = ({
  infoDetail, insideCommunityName,
}: InfoHeaderProps) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const {
    name, userCount, backgroundImgUrl, icon, privacy,
  } = infoDetail;
  const privacyData = GroupPrivacyDetail[privacy] || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData;

  const renderCoverAvatar = () => (
    <View testID="info_header.cover" style={styles.coverAvatarContainer}>
      <Image
        style={styles.cover}
        resizeMode="cover"
        source={{ uri: backgroundImgUrl }}
        defaultSource={images.img_cover_default}
      />
      <Avatar.Large
        showBorder
        style={styles.avatar}
        resizeMode="contain"
        source={{ uri: icon }}
        defaultSource={images.img_group_avatar_default}
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
              tintColor={theme.colors.neutral20}
            />
            <Text.BodyMMedium
              style={styles.privacyText}
              testID="info_header.privacy"
            >
              {t(privacyTitle)}
            </Text.BodyMMedium>
            <Text.BodyMMedium
              style={styles.memberCount}
              color={theme.colors.neutral80}
              testID="info_header.member_count"
            >
              {formatLargeNumber(userCount)}
            </Text.BodyMMedium>
            <Text.BodyM>
              {`${t('groups:title_members', {
                count: userCount,
              })}`}
            </Text.BodyM>
          </View>
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

const InfoHeader = React.memo(_InfoHeader);
InfoHeader.whyDidYouRender = true;
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
      marginLeft: spacing.margin.big,
      marginRight: spacing.margin.small,
    },
  });
};
