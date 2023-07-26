import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import GroupItem, { GroupItemProps } from '../GroupItem';
import { IGroup } from '~/interfaces/IGroup';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import useGroupTreeStore from '../store';

// GroupSchemeAssignment doesn't have id but groupId
const selector = (item) => (state) => state.collapsedIds[item?.id || item?.groupId];

export interface GroupTreeItemProps extends GroupItemProps {
  onToggle?: (item: IGroup, isCollapsed: boolean) => void;
}

const GroupTreeItem: FC<GroupTreeItemProps> = ({
  style, item, isChecked, onToggle, index, ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const collapsedState = useGroupTreeStore(useCallback(selector(item), [item]));
  const actions = useGroupTreeStore((state) => state.actions);

  const isCollapsed = item?.collapsed || collapsedState;

  const renderToggle = (group: IGroup, children: IGroup[]) => {
    if (isEmpty(children)) return <View style={styles.toggleContainer} />;

    const icon = isCollapsed ? 'CirclePlus' : 'CircleMinus';

    const _onToggleItem = () => {
      if (!props.isNotCollapsible) {
        // GroupSchemeAssignment doesn't have id but groupId
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        actions.toggle(group.id || group.groupId);
        onToggle?.(group, !isCollapsed);
      }
    };

    return (
      <View style={styles.toggleContainer}>
        <Icon
          testID="group_item.button_wrapper.icon"
          size={14}
          icon={icon}
          style={styles.toggleIcon}
          tintColor={theme.colors.neutral20}
          onPress={_onToggleItem}
        />
      </View>
    );
  };

  const renderLines = (level: number) => {
    if (level <= 0) return null;

    const newLevel = !props.isNotCollapsible ? level : index;

    return Array.from(Array(newLevel).keys()).map((item) => (
      <View
        key={`group-tree-item-level-${level}-${item}`}
        style={styles.line}
      />
    ));
  };

  const level = item?.level;
  const children = item?.children || [];

  const isDisableLastItem = props.isDisableLastItem && children.length === 0;
  if (isDisableLastItem) return null;

  return (
    <View style={style} testID={`group_tree_item_${index}`}>
      <View style={styles.childContainer}>
        {renderLines(level)}
        {renderToggle(item, item.children)}
        <GroupItem
          {...props}
          style={styles.itemContainer}
          item={item}
          isChecked={isChecked}
        />
      </View>
      {!isCollapsed && (
        <Animated.View entering={FadeInDown}>
            {children.map((child: IGroup) => (
              <GroupTreeItem
                {...props}
                key={`group-tree-item-${child.id}`}
                item={child}
                index={index + 1}
              />
            ))}
        </Animated.View>
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    childContainer: {
      flexDirection: 'row',
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: spacing.padding.small,
      paddingVertical: spacing?.padding.small,
    },
    line: {
      width: 1,
      height: '100%',
      backgroundColor: colors.neutral5,
      marginHorizontal: spacing.margin.small,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 20,
    },
    toggleIcon: {
      backgroundColor: colors.white,
      paddingVertical: spacing?.padding.tiny,
    },
  });
};

export default GroupTreeItem;
