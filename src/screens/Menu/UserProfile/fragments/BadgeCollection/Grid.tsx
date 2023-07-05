import React, { useEffect } from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import dimension from '~/theme/dimension';
import { IUserBadge } from '~/interfaces/IEditUser';
import GridItem from './GridItem';
import useUserBadge from './store';

const ITEM_WIDTH = 48; // Constant item width
const ITEM_MARGIN = 6; // Constant item margin
const CONTAINER_PADDING = 10; // Constant container padding

interface Props {
  data: IUserBadge[];
  isNew?: boolean;
  disabled?: boolean;
  shouldHideBadgeNew?: boolean;
  onPress: (item: IUserBadge, isSelected: boolean) => void;
}

const Grid = ({
  data,
  isNew = false,
  disabled = false,
  shouldHideBadgeNew = false,
  onPress,
}:Props) => {
  const numColumns = Math.floor((dimension.deviceWidth - CONTAINER_PADDING * 2) / (ITEM_WIDTH + ITEM_MARGIN * 2));
  const CONTAINER_PADDING_PLUS = (
    dimension.deviceWidth
    - numColumns * (ITEM_WIDTH + ITEM_MARGIN * 2)
    - CONTAINER_PADDING * 2) / 2;

  const actions = useUserBadge((state) => state.actions);

  useEffect(() => {
    if (Boolean(isNew)) {
      actions.markNewBadgeInCommunity(data);
    }
  }, [isNew, data]);

  if (data.length === 0) {
    return null;
  }

  const renderGridItem = ({ item }: any) => (
    <GridItem
      id={item.id}
      disabled={disabled}
      shouldHideBadgeNew={shouldHideBadgeNew}
      onPress={onPress}
    />
  );

  return (
    <View style={[styles.container, data?.length > numColumns ? {}
      : {
        paddingLeft: CONTAINER_PADDING + CONTAINER_PADDING_PLUS,
        alignItems: 'flex-start',
      }]}
    >
      <FlatList
        testID="badge_collection.list_badges"
        data={data}
        renderItem={renderGridItem}
        keyExtractor={(item) => `badge_collection.${item.id}`}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: CONTAINER_PADDING,
  },
});

export default Grid;
