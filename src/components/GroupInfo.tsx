import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import { Avatar } from '~/baseComponents';
import useBaseHook from '~/hooks/baseHook';
import images from '~/resources/images';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { formatLargeNumber } from '~/utils/formatter';

interface GroupInfoProps {
  name: string;
  icon: string;
  privacy: string;
  userCount: number;
}

const GroupInfo = (props: GroupInfoProps) => {
  const {
    name, icon, privacy, userCount,
  } = props || {};
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles();
  const { t } = useBaseHook();

  const privacyData = GroupPrivacyDetail[privacy] || {};
  const { icon: iconPrivacy, privacyTitle }: any = privacyData;

  return (
    <View testID="group_info" style={styles.container}>
      <Avatar.Large
        showBorder
        resizeMode="cover"
        source={{ uri: icon }}
        defaultSource={images.img_group_avatar_default}
      />
      <View style={styles.textGroupInfo}>
        <Text.SubtitleM numberOfLines={2} color={theme.colors.neutral80}>
          {name}
        </Text.SubtitleM>
        <View style={styles.privacyAndUserCount}>
          <Icon icon={iconPrivacy} size={16} tintColor={theme.colors.neutral20} />
          <Text.BodySMedium style={styles.text} color={theme.colors.neutral40} testID="info_header.privacy">
            {t(privacyTitle)}
          </Text.BodySMedium>
          <Icon icon="UserGroupSolid" size={18} tintColor={theme.colors.neutral20} style={styles.icon} />
          <Text.BodySMedium style={styles.text} color={theme.colors.neutral40} testID="info_header.member_count">
            {formatLargeNumber(userCount)}
          </Text.BodySMedium>
        </View>
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.large,
  },
  textGroupInfo: {
    flex: 1,
    marginLeft: spacing.margin.small,
    justifyContent: 'center',
  },
  privacyAndUserCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.tiny,
  },
  text: {
    marginLeft: spacing.margin.small,
  },
  icon: {
    marginLeft: spacing.margin.large,
  },
});
export default GroupInfo;
