import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {spacing} from '~/theme/configs';
import _ from 'lodash';
import items from './items';
import ViewSpacing from '../ViewSpacing';
import Text from '../Text';
import {margin} from '~/theme/configs/spacing';

export interface IListView {
  data?: Array<any>;
  type: string;
  onItemPress?: Function;
  renderItemSeparator?: Function;
  horizontal?: boolean;
  loading?: boolean;
  title?: string;
  [x: string]: any;
}

export const itemTypes = {
  user: 'user',
};

const ListView: React.FC<IListView> = ({
  data,
  type,
  renderItemSeparator,
  onItemPress,
  horizontal,
  loading,
  title,
  ...props
}) => {
  const getKeyValue =
    <T extends object, U extends keyof T>(obj: T) =>
    (key: U) =>
      obj[key];

  const Component = getKeyValue(items)(type);

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => onItemPress && onItemPress(item)}>
        <Component {...item} />
      </TouchableOpacity>
    );
  };

  const renderDefaultItemSeparator = () => (
    <ViewSpacing
      width={horizontal ? spacing.margin.small : 0}
      height={!horizontal ? spacing.margin.small : 0}
    />
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        {...props}
        data={data}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={item => _renderItem(item)}
        initialNumToRender={10}
        ItemSeparatorComponent={() =>
          renderItemSeparator
            ? renderItemSeparator()
            : renderDefaultItemSeparator()
        }
        keyExtractor={(item, index) => _.uniqueId(`list-${type}-${index}`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: margin.large,
  },
});

export default React.memo(ListView);
