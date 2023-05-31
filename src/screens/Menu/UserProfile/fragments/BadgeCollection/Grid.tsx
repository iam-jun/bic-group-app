import React from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import dimension from '~/theme/dimension';
import { IUserBadge } from '~/interfaces/IEditUser';
import GridItem from './GridItem';

const itemWidth = 48; // Constant item width

interface Props {
    data: IUserBadge[];
    disabled?: boolean;
    onPress: (item: IUserBadge) => void;
}

const Grid = ({ data, disabled = false, onPress }:Props) => {
  const numColumns = Math.floor((dimension.deviceWidth - 10 * 2) / (itemWidth + 6 * 2));

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
    <View style={[styles.container, data?.length > numColumns ? {} : styles.containerLeft]}>
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
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
});

export default Grid;
