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
import items, {IListViewItem} from './items';
import ViewSpacing from '../ViewSpacing';
import Text from '../Text';
import loadings from '../Loading';
import {IAction} from '~/constants/commonActions';

export interface IListView {
  data?: Array<any>;
  type: IListViewItem;
  onItemPress?: Function;
  onActionPress?: Function;
  renderItemSeparator?: Function;
  horizontal?: boolean;
  loading?: boolean;
  title?: string;
  listRef?: React.Ref<FlatList>;
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
  onActionPress,
  horizontal,
  loading,
  title,
  listRef,
  ...props
}) => {
  const getKeyValue =
    <T extends object, U extends keyof T>(obj: T) =>
    (key: U) =>
      obj[key];

  const Component = getKeyValue(items)(type);
  const Loading = getKeyValue(loadings)(type);

  const _onActionPress = (action: IAction) => {
    onActionPress && onActionPress(action);
  };

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => onItemPress && onItemPress(item)}>
        <Component {...item} onActionPress={_onActionPress} />
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
    return (
      <View>
        {Loading ? (
          <View>
            {Array.from(Array(10).keys()).map(item => (
              <Loading />
            ))}
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        {...props}
        ref={listRef}
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
    margin: spacing.margin.large,
  },
});

const _ListView = React.forwardRef(
  (props: IListView, ref?: React.Ref<FlatList>) => (
    <ListView listRef={ref} {...props} />
  ),
);

export default React.memo(_ListView);
