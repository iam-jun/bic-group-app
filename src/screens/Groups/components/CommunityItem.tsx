import {View, StyleSheet} from 'react-native';
import React from 'react';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

import {ExtendedTheme, useTheme} from '@react-navigation/native';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import privacyTypes from '~/constants/privacyTypes';
import {ICommunity} from '~/interfaces/ICommunity';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

interface CommunityItemProps {
  item: ICommunity;
  onPressCommunities?: (communityId: string) => void;
  onPressMenu?: () => void;
}

const CommunityItem = ({
  item,
  onPressCommunities,
  onPressMenu,
}: CommunityItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();

  const {id, name, icon, user_count, privacy} = item || {};
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

  const renderContentComponent = () => {
    return (
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
        <Text.BodyS color={colors.gray50}>{`  •  `}</Text.BodyS>
        <Text.BodyS color={colors.gray50}>{`${user_count} ${t(
          'groups:text_members',
          {
            count: user_count,
          },
        )}`}</Text.BodyS>
      </View>
    );
  };

  return (
    <PrimaryItem
      showAvatar
      avatar={icon}
      avatarProps={{variant: 'largeAlt'}}
      style={styles.item}
      title={name}
      titleProps={{variant: 'h5'}}
      testID="community_item"
      onPress={() => onPressCommunities?.(id)}
      ContentComponent={renderContentComponent()}
      onPressMenu={onPressMenu}
    />
  );
};

export default CommunityItem;

const createStyles = (theme: ExtendedTheme) => {
  return StyleSheet.create({
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
};
