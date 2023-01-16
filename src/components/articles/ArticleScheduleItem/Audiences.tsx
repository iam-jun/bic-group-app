import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IPostAudience } from '~/interfaces/IPost';
import { useRootNavigation } from '~/hooks/navigation';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import mainStack from '~/router/navigator/MainStack/stack';
import Tag from '~/baseComponents/Tag';

interface IAudiences {
    audience: IPostAudience;
}

const Audiences: React.FC<IAudiences> = ({ audience }) => {
  const theme = useTheme();
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const { groups = [] } = audience || {};

  const navigateToGroup = (groupId: any, communityId: any) => {
    rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
  };

  const navigateToCommunity = (communityId: string) => {
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const onPressAudience = (item: any) => {
    const { id, communityId, isCommunity } = item || {};
    if (isCommunity && communityId) {
      navigateToCommunity(communityId);
    } else {
      navigateToGroup(id, communityId);
    }
  };

  const renderItem = ({ item }) => (
    <Tag
      style={styles.tagContainer}
      type="neutral"
      size="small"
      label={item.name}
      onActionPress={() => onPressAudience(item)}
    />
  );

  const keyExtractor = (item) => `audiences_${item?.id}`;

  return (
    <View style={styles.boxAudience}>
      <Text.BodyXS color={colors.neutral60}>
        {`${t('common:audiences')}:`}
      </Text.BodyXS>
      <ViewSpacing width={spacing.margin.small} />
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boxAudience: {
    marginTop: spacing.margin.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    alignSelf: 'baseline',
  },
});

export default Audiences;
