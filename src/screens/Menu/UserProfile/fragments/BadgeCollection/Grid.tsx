import React from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import dimension from '~/theme/dimension';
import { IUserBadge } from '~/interfaces/IEditUser';
import GridItem from './GridItem';

const ITEM_WIDTH = 48; // Constant item width
const ITEM_MARGIN = 6; // Constant item margin
const CONTAINER_PADDING = 10; // Constant container padding

interface Props {
  data: IUserBadge[];
  disabled?: boolean;
  onPress: (item: IUserBadge, isSelected: boolean) => void;
}

const Grid = ({
  data, disabled = false, onPress,
}:Props) => {
  const numColumns = Math.floor((dimension.deviceWidth - CONTAINER_PADDING * 2) / (ITEM_WIDTH + ITEM_MARGIN * 2));
  const CONTAINER_PADDING_PLUS = (
    dimension.deviceWidth
    - numColumns * (ITEM_WIDTH + ITEM_MARGIN * 2)
    - CONTAINER_PADDING * 2) / 2;

  if (data.length === 0) {
    return null;
  }

  const renderGridItem = ({ item, index }: any) => (
    <GridItem
      item={item}
      numColumns={numColumns}
      index={index}
      disabled={disabled}
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
        data={data}
        renderItem={renderGridItem}
        keyExtractor={(item, index) => index.toString()}
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
