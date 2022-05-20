import {FlatList} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

import Divider from '~/beinComponents/Divider';
import EmptyScreen from '~/beinFragments/EmptyScreen';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import CommunityItem from '../components/CommunityItem';
import {ITheme} from '~/theme/interfaces';
import {ICommunity} from '~/interfaces/ICommunity';

interface ManagedCommunitiesProps {
  onPressCommunities?: (community: ICommunity) => void;
  onPressMenu?: (community?: any) => void;
}

const ManagedCommunities = ({
  onPressCommunities,
  onPressMenu,
}: ManagedCommunitiesProps) => {
  const theme = useTheme() as ITheme;
  const {spacing} = theme;

  const managedCommunities = useKeySelector(
    // TODO: Chagned to managed communities when API is ready
    groupsKeySelector.joinedCommunities,
  );

  const renderEmptyComponent = () => {
    return (
      <EmptyScreen
        source={'addUsers'}
        title="communities:empty_communities:title"
        description="communities:empty_communities:manage_description"
      />
    );
  };

  const renderItem = ({item}: {item: ICommunity}) => {
    return (
      <CommunityItem
        item={item}
        onPressMenu={onPressMenu}
        onPressCommunities={onPressCommunities}
      />
    );
  };

  return (
    <FlatList
      testID="flatlist"
      data={managedCommunities}
      renderItem={renderItem}
      keyExtractor={(item, index) => `community_item_${item}_${index}`}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={() => (
        <Divider
          style={{
            marginVertical: spacing.margin.tiny,
            marginHorizontal: spacing.margin.large,
          }}
        />
      )}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={onRefresh}
      //     tintColor={theme.colors.borderDisable}
      //   />
      // }
    />
  );
};

export default ManagedCommunities;
