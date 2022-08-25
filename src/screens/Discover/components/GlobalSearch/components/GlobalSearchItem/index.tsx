import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { communityPrivacyListDetail } from '~/constants/privacyTypes';
import { margin, padding } from '~/theme/spacing';
import { Avatar } from '~/baseComponents';
import ButtonCommunityGroupCardAction from '~/components/CommunityGroupCard/ButtonCommunityGroupCardAction';
import { isGroup } from '~/screens/groups/helper';

interface GlobalSearchItemProps {
  item: any;
  onView?: (item: any) => void;
  onJoin?: (item: any) => void;
  onCancel?: (item: any) => void;
}

const GlobalSearchItem = ({
  item, onView, onCancel, onJoin,
}: GlobalSearchItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const {
    name, icon, privacy, level, joinStatus,
  } = item || {};
  const privacyData = communityPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon }: any = privacyData || {};
  const itemType = isGroup(level) ? 'common:text_group' : 'common:text_community';

  const _onView = () => onView(item);
  const _onJoin = () => onJoin(item);
  const _onCancel = () => onCancel(item);

  return (
    <View style={styles.container}>
      <Avatar.Base source={icon} badgeBottom badge={privacyIcon} />
      <View style={styles.groupInfo}>
        <View style={styles.titleContainer}>
          <Text.H6>{name}</Text.H6>
        </View>
        <View style={styles.groupInfoBottom}>
          <View style={styles.chip}>
            <Text.BodyXS useI18n color={colors.blue50}>{itemType}</Text.BodyXS>
          </View>
          <ButtonCommunityGroupCardAction
            joinStatus={joinStatus}
            size="small"
            onView={_onView}
            onJoin={_onJoin}
            onCancel={_onCancel}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: padding.large,
      paddingVertical: padding.small,
    },
    titleContainer: {
      paddingVertical: padding.small,
    },
    groupInfo: {
      flex: 1,
      marginLeft: margin.small,
    },
    groupInfoBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    chip: {
      backgroundColor: colors.blue2,
      borderRadius: 100,
      paddingHorizontal: padding.small,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconSmall: {
      marginRight: margin.tiny,
      height: 16,
    },
  });
};

export default GlobalSearchItem;
