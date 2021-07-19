import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import _ from 'lodash';

import {spacing} from '~/theme';
import items, {IListViewItem} from './items';
import ViewSpacing from '../ViewSpacing';
import Text from '../texts/Text';
import loadings from './loadings';
import {IAction} from '~/constants/commonActions';
import {grey5} from '~/theme/colors';

export interface IListView {
  data?: Array<any>;
  type: IListViewItem;
  onItemPress?: Function;
  onActionPress?: Function;
  renderItemSeparator?: Function;
  horizontal?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  loadingMore?: boolean;
  onRefresh?: () => void;
  title?: string;
  isFullView?: boolean;
  listRef?: React.Ref<FlatList>;
  containerStyle?: StyleProp<ViewStyle>;
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
  loadingMore,
  refreshing,
  onRefresh,
  title,
  isFullView,
  listRef,
  containerStyle,
  ...props
}) => {
  const getKeyValue =
    <T extends object, U extends keyof T>(obj: T) =>
    (key: U) =>
      obj[key];

  const Component = getKeyValue(items)(type);
  const Loading = getKeyValue(loadings)(type);

  const _renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        disabled={!onItemPress}
        onPress={() => onItemPress && onItemPress(item)}>
        <Component
          {...item}
          onActionPress={
            onActionPress
              ? (action: IAction) => onActionPress(action, item)
              : undefined
          }
        />
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
          <ActivityIndicator color={grey5} />
        )}
      </View>
    );
  }

  return (
    <View style={[isFullView && styles.fullView, containerStyle]}>
      {title && <Text.H2 style={styles.title}>{title}</Text.H2>}
      <FlatList
        {...props}
        ref={listRef}
        data={data}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        renderItem={item => _renderItem(item)}
        initialNumToRender={10}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        ItemSeparatorComponent={() =>
          renderItemSeparator
            ? renderItemSeparator()
            : renderDefaultItemSeparator()
        }
        keyExtractor={(item, index) => _.uniqueId(`list-${type}-${index}`)}
      />
      {loadingMore && <ActivityIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
  },
  title: {
    margin: spacing.margin.large,
  },
});

const _ListView = React.forwardRef(
  (props: IListView, ref?: React.Ref<FlatList>) => (
    <ListView listRef={ref} {...props} />
  ),
);

export default React.memo(_ListView);
