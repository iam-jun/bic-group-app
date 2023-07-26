import {
  View, StyleSheet, FlatList, ActivityIndicator, Omit, FlatListProps, StyleProp, ViewStyle,
} from 'react-native';
import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IGroup } from '~/interfaces/IGroup';
import spacing, { padding } from '~/theme/spacing';
import NoSearchResultsFound from '~/components/NoSearchResultsFound';
import GroupTreeItem from '../GroupTreeItem';
import GroupItem, { GroupItemProps } from '../GroupItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useGroupTreeStore from '../store';

export interface GroupListProps extends Omit<FlatListProps<IGroup>, 'renderItem'> {
    mode?: 'flat'|'tree';
    loading?: boolean;
    itemProps?: Omit<GroupItemProps, 'item'>;
    resetOnHide?: boolean;
    styleList?: StyleProp<ViewStyle>;
    styleListFooter?: StyleProp<ViewStyle>;

    onToggle?: (item: IGroup, isCollapsed: boolean) => void;
    onPressItem?: (item: IGroup) => void;
}

const _GroupList: FC<GroupListProps> = ({
  mode = 'flat',
  data,
  loading,
  itemProps,
  resetOnHide = true,
  styleList = {},
  styleListFooter = {},

  onToggle,
  onPressItem,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const resetGroupTree = useGroupTreeStore((state) => state.reset);

  useEffect(() => () => {
    if (resetOnHide) resetGroupTree();
  }, []);

  const ListEmptyComponent = loading ? null : <NoSearchResultsFound />;

  const ListFooterComponent = (
    <View style={[styles.footer, styleListFooter]}>
      {loading && (
      <ActivityIndicator size="large" color={theme.colors.neutral5} />
      )}
    </View>
  );

  const renderItemSeperator = () => (mode === 'flat' && <ViewSpacing height={padding.small} />);

  const renderItem = ({ item, index }) => {
    if (mode === 'flat') return <GroupItem {...itemProps} item={item} onPress={onPressItem} />;

    return <GroupTreeItem {...itemProps} item={item} index={index} onToggle={onToggle} onPress={onPressItem} />;
  };

  const keyExtractor = (item: IGroup, index: number) => `group_list_${item?.id}_${index}`;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={[styles.list, styleList]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={renderItemSeperator}
        {...props}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    list: {
      paddingHorizontal: padding.large,
    },
    footer: {
      marginBottom: spacing.margin.large,
    },
  });
};

const GroupList = React.memo(_GroupList);
GroupList.whyDidYouRender = true;
export default GroupList;
