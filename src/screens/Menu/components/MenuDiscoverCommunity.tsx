import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import Button from '~/beinComponents/Button';
import { Avatar } from '~/baseComponents';
import { avatarSizes } from '~/theme/dimension';
import { ICommunity } from '~/interfaces/ICommunity';
import useMenuController from '../store';
import JoinedCommunityPlaceholder from './JoinedCommunityPlaceholder';
import { navigateToCommunityDetail } from '~/router/helper';

export const MAX_LENGTH = 10;

const MenuDiscoverCommunity = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle();

  const { data = [], loading, actions } = useMenuController();

  useEffect(() => {
    actions.getJoinedCommunities();
  }, []);

  const onPressCommunity = (item: ICommunity) => {
    navigateToCommunityDetail({ communityId: item?.id });
  };

  const renderItem = ({ item, index }) => (
    <Button
      testID="menu_discover_community.item"
      onPress={() => onPressCommunity(item)}
    >
      <Avatar.Large
        source={item.icon}
        style={{
          marginLeft: index === 0 ? spacing.margin.large : spacing.margin.tiny,
          marginRight: index === (data?.length || 0) - 1 ? spacing.margin.large : spacing.margin.tiny,
        }}
      />
    </Button>
  );

  const renderContent = () => {
    if (loading && data.length === 0) {
      return (
        <View
          testID="menu_discover_community.loading"
          style={styles.emptyContainer}
        >
          <JoinedCommunityPlaceholder />
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View
          testID="menu_discover_community.empty_list"
          style={styles.emptyContainer}
        >
          <Text.SubtitleS color={theme.colors.neutral20} useI18n>
            communities:empty_communities:title
          </Text.SubtitleS>
        </View>
      );
    }

    return (
      <FlatList
        data={data?.slice?.(0, MAX_LENGTH)}
        horizontal
        style={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => `menu-joined-community-${item.id}`}
      />
    );
  };

  return (
    <View style={styles.container} testID="menu_discover_community">
      <Text.SubtitleS style={styles.textTitle} useI18n>menu:title_your_community</Text.SubtitleS>
      {renderContent()}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    paddingTop: spacing.padding.large,
    paddingBottom: spacing.padding.small,
  },
  textTitle: {
    paddingHorizontal: spacing.padding.large,
  },
  listContainer: {
    paddingTop: spacing.padding.small,
  },
  emptyContainer: {
    height: avatarSizes.large,
    marginTop: spacing.margin.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuDiscoverCommunity;
