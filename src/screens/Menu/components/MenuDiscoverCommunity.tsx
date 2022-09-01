import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import useJoinedCommunitiesStore from '~/screens/Menu/store/joinedCommunities';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import Button from '~/beinComponents/Button';
import { ICommunity } from '~/interfaces/ICommunity';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { Avatar } from '~/baseComponents';
import { avatarSizes } from '~/theme/dimension';

const MAX_LENGTH = 10;

const MenuDiscoverCommunity = () => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle();

  const { data = [], loading, getJoinedCommunities } = useJoinedCommunitiesStore();

  useEffect(() => {
    getJoinedCommunities();
  }, []);

  const onPressCommunity = (item: ICommunity) => {
    rootNavigation.navigate(groupStack.communityDetail, { communityId: item?.id });
  };

  const renderItem = ({ item, index }) => (
    <Button onPress={() => onPressCommunity(item)}>
      <Avatar.Large
        source={item.icon}
        style={{
          marginLeft: index === 0 ? spacing.margin.large : spacing.margin.tiny,
          marginRight: index === (data?.length || 0) - 1 ? spacing.margin.large : spacing.margin.tiny,
        }}
      />
    </Button>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading
        ? <LoadingIndicator />
        : (
          <Text.SubtitleS color={theme.colors.neutral20} useI18n>
            communities:empty_communities:title
          </Text.SubtitleS>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text.SubtitleS style={styles.textTitle} useI18n>menu:title_your_community</Text.SubtitleS>
      {data?.length > 0
        ? (
          <FlatList
            data={data?.slice?.(0, MAX_LENGTH)}
            horizontal
            style={styles.listContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => `menu-joined-community-${item.id}`}
          />
        )
        : renderEmpty()}
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
