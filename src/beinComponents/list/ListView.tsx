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
} from 'react-native';
import _ from 'lodash';

import {spacing} from '~/theme';
import items, {IListViewItem} from '~/beinComponents/list/items';
import ViewSpacing from '../../components/ViewSpacing';
import loadings from '../../components/list/loadings';
import {IAction} from '~/constants/commonActions';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

export interface ListViewProps {
  data?: Array<any>;
  type?: IListViewItem;
  listRef?: React.Ref<FlatList>;
  listStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  onItemPress?: (...params: any) => void;
  onActionPress?: (...params: any) => void;
  onRefresh?: () => void;

  renderItem?: ({item, index}: {item: any; index: number}) => React.ReactNode;
  renderItemSeparator?: any;
  renderLoading?: any;
  ListHeaderComponent: any;
  ListFooterComponent: any;
  ListEmptyComponent: any;

  horizontal?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  loadingMore?: boolean;
  title?: string;
  isFullView?: boolean;
  [x: string]: any;
}

const ListView: React.FC<ListViewProps> = ({
  data,
  type = 'primary',
  listRef,
  listStyle,
  containerStyle,

  onItemPress,
  onActionPress,
  onRefresh,

  renderItem,
  renderItemSeparator,
  renderLoading,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,

  horizontal,
  loading,
  loadingMore,
  refreshing,
  title,
  isFullView,
  ...props
}: ListViewProps) => {
  const {colors}: ITheme = useTheme();

  const ItemComponent = items[type] || PrimaryItem;
  const LoadingPlaceholder = loadings[type];

  const _renderItem = ({item, index}: {item: any; index: number}) => {
    if (renderItem) {
      return renderItem({item, index});
    }

    return (
      <TouchableOpacity
        disabled={!onItemPress}
        onPress={() => onItemPress && onItemPress(item)}>
        <ItemComponent
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

  const _renderItemSeparator = () => {
    if (renderItemSeparator) {
      return renderItemSeparator();
    }
    return (
      <ViewSpacing
        width={horizontal ? spacing.margin.small : 0}
        height={!horizontal ? spacing.margin.small : 0}
      />
    );
  };

  if (loading) {
    if (renderLoading) {
      return renderLoading();
    }
    if (LoadingPlaceholder) {
      return (
        <View>
          {Array.from(Array(10).keys()).map(item => (
            <LoadingPlaceholder key={`loading_placeholder_${item}`} />
          ))}
        </View>
      );
    }
    return (
      <View>
        <ActivityIndicator color={colors.borderDisable} />
      </View>
    );
  }

  return (
    <View style={StyleSheet.flatten([isFullView && {flex: 1}, containerStyle])}>
      {title && (
        <Text.H2 style={{margin: spacing.margin.large}}>{title}</Text.H2>
      )}
      <FlatList
        ref={listRef}
        data={data}
        style={listStyle}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={item => _renderItem(item)}
        initialNumToRender={10}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={_renderItemSeparator}
        keyExtractor={(item, index) => _.uniqueId(`list-${type}-${index}`)}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...props}
      />
      {loadingMore && <ActivityIndicator />}
    </View>
  );
};

const _ListView = React.forwardRef(
  (props: ListViewProps, ref?: React.Ref<FlatList>) => (
    <ListView listRef={ref} {...props} />
  ),
);

export default React.memo(_ListView);
