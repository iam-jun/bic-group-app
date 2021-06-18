import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {spacing} from '~/theme/configs';
import _ from 'lodash';
import items from './items';
import ViewSpacing from '../ViewSpacing';
import {ActivityIndicator} from 'react-native-paper';
import Title from '../Text/Title';

export interface IListView {
  data?: Array<any>;
  type: string;
  onItemPress?: Function;
  renderItemSeparator?: Function;
  horizontal?: boolean;
  loading?: boolean;
  title?: React.ReactNode;
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
      width={horizontal ? spacing.margin.tiny : 0}
      height={!horizontal ? spacing.margin.tiny : 0}
    />
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {title && <Title>{title}</Title>}
      <FlatList
        {...props}
        data={data}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={item => _renderItem(item)}
        ItemSeparatorComponent={() =>
          renderItemSeparator
            ? renderItemSeparator()
            : renderDefaultItemSeparator()
        }
        keyExtractor={(item, index) =>
          _.uniqueId(`list-${item.displayName || ''}-${index}`)
        }
      />
    </View>
  );
};

export default ListView;
