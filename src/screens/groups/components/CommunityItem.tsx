import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { CommunityPrivacyDetail } from '~/constants/privacyTypes';
import { ICommunity } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

interface CommunityItemProps {
  item: ICommunity;
  onPressMenu?: () => void;
  onPressCommunities?: (communityId: string) => void;
}

const CommunityItem = ({
  item,
  onPressMenu,
  onPressCommunities,
}: CommunityItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { t } = useBaseHook();

  const {
    id, name, icon, userCount, privacy,
  } = item || {};
  const privacyData = CommunityPrivacyDetail[privacy] || {};
  const { icon: privacyIcon, title: privacyTitle }: any = privacyData;

  const renderContentComponent = () => (
    <View style={styles.groupInfo}>
      <Icon
        style={styles.iconSmall}
        icon={privacyIcon}
        size={16}
        tintColor={colors.gray50}
      />
      <Text.BodyS color={colors.gray50} useI18n>
        {privacyTitle}
      </Text.BodyS>
      <Text.BodyS color={colors.gray50}>{'  •  '}</Text.BodyS>
      <Text.BodyS color={colors.gray50}>
        {`${userCount} ${t(
          'groups:text_members',
          {
            count: userCount,
          },
        )}`}
      </Text.BodyS>
    </View>
  );

  return (
    <PrimaryItem
      showAvatar
      avatar={icon}
      avatarProps={{ variant: 'large' }}
      style={styles.item}
      title={name}
      titleProps={{ variant: 'h5' }}
      testID="community_item"
      onPress={() => onPressCommunities?.(id)}
      ContentComponent={renderContentComponent()}
      onPressMenu={onPressMenu}
    />
  );
};

export default CommunityItem;

const createStyles = () => StyleSheet.create({
  item: {
    height: '100%',
    flex: 1,
    paddingVertical: spacing.padding.small,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  iconSmall: {
    marginRight: spacing.margin.tiny,
    height: 16,
  },
});
