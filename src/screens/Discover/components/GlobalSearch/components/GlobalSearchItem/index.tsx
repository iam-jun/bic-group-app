import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { communityPrivacyListDetail } from '~/constants/privacyTypes';
import { ICommunity } from '~/interfaces/ICommunity';
import { useBaseHook } from '~/hooks';
import { margin, padding } from '~/theme/spacing';
import { Avatar } from '~/baseComponents';
import { IGroup } from '~/interfaces/IGroup';

interface GlobalSearchItemProps {
  item: ICommunity | IGroup;
  onPressCommunities?: (communityId: string) => void;
  onPressMenu?: () => void;
}

const GlobalSearchItem = ({
  item,
  onPressCommunities,
  onPressMenu,
}: GlobalSearchItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { t } = useBaseHook();

  const {
    name, icon, privacy,
  } = item || {};
  const privacyData = communityPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon, title: privacyTitle }: any = privacyData || {};
  const itemType = item.community ? 'Group' : 'Community';

  // <PrimaryItem
  //   showAvatar
  //   avatar={icon}
  //   avatarProps={{ variant: 'large' }}
  //   style={styles.item}
  //   title={name}
  //   titleProps={{ variant: 'h5' }}
  //   testID="community_item"
  //   onPress={() => onPressCommunities?.(id)}
  //   ContentComponent={renderContentComponent()}
  //   onPressMenu={onPressMenu}
  // />

  return (
    <View style={styles.container}>
      <Avatar.Base source={icon} badgeBottom badge={privacyIcon} />
      <View style={styles.groupInfo}>
        <Text.H6>{name}</Text.H6>
        <View>
          <View>
            <Text.BadgeXS>{itemType}</Text.BadgeXS>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: padding.large,
    paddingVertical: padding.small,
  },
  item: {
    height: '100%',
    flex: 1,
    paddingVertical: padding.small,
  },
  groupInfo: {
    marginLeft: margin.small,
  },
  iconSmall: {
    marginRight: margin.tiny,
    height: 16,
  },
});

export default GlobalSearchItem;
