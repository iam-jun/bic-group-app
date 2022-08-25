import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { isArray, isObject } from 'lodash';

import { IGroup, IParsedGroup } from '~/interfaces/IGroup';
import GroupItem, { GroupItemProps } from '~/beinComponents/list/items/GroupItem';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import { AvatarType } from '~/baseComponents/Avatar/AvatarComponent';
import { IconType } from '~/resources/icons';

export interface GroupTreeProps {
  groupStyle?: StyleProp<ViewStyle>;
  data?: IGroup[] | IGroup;
  selectingData?: OnChangeCheckedGroupsData;
  onChangeCheckedGroups?: (data: OnChangeCheckedGroupsData) => void;
  toggleOnPress?: boolean;
  onPressGroup?: (group: IGroup) => void;
  onToggle?: (group: IGroup, isCollapse: boolean) => void;
  onPressMenu?: (item: GroupItemProps) => void;
  showPrivacy?: boolean;
  showPrivacyName?: boolean;
  showPrivacyAvatar?: boolean;
  showInfo?: boolean;
  disableOnPressItem?: boolean;
  disableHorizontal?: boolean;
  iconVariant?: AvatarType;
  nameLines?: number;
  menuIcon?: IconType;
  renderExtraInfo?: (group: IGroup) => any;
}

type TreeData = {[x: string]: IParsedGroup};

export type OnChangeCheckedGroupsData = {[x: string]: IGroup | false};

const GroupTree: React.FC<GroupTreeProps> = ({
  groupStyle,
  data,
  selectingData,
  onChangeCheckedGroups,
  onPressGroup,
  onToggle,
  onPressMenu,
  toggleOnPress,
  showPrivacy,
  showPrivacyName,
  showPrivacyAvatar,
  showInfo,
  disableOnPressItem,
  disableHorizontal,
  iconVariant,
  nameLines,
  menuIcon,
  renderExtraInfo,
}: GroupTreeProps) => {
  const [treeData, setTreeData] = useState<TreeData>({});
  const [renderedTree, setRenderedTree] = useState<React.ReactNode[]>([]);

  const { rootNavigation } = useRootNavigation();
  const styles = createStyle();

  const parseTreeData = () => {
    const newData: {[x: string]: IParsedGroup} = {};
    if (isArray(data)) {
      data?.map?.((
        group, index,
      ) => getItem(
        group, newData, 0, 'tree', index,
      ));
      setTreeData(newData);
    } else if (isObject(data)) {
      getItem(
        data, newData, 0, 'tree', 0,
      );
      setTreeData(newData);
    } else {
      console.warn('\x1b[31m', '🐣️ parse tree data: unknown ', data, '\x1b[0m');
    }
  };

  useEffect(
    () => {
      renderTree();
    }, [treeData],
  );

  useEffect(
    () => {
      if (data) {
        parseTreeData();
      }
    }, [data],
  );

  const _onPressGroup = (group: GroupItemProps) => {
    if (onChangeCheckedGroups) {
      onCheckedGroup(
        group, !treeData[group.uiId].isChecked,
      );
    } else if (onPressGroup) {
      onPressGroup(group);
    } else if (toggleOnPress) {
      onToggleGroup(group);
    } else if (group.communityId) {
      rootNavigation.navigate(mainStack.communityDetail, {
        communityId: group.communityId,
      });
    } else {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId: group.id,
          initial: true,
        },
      );
    }
  };

  /**
   * Logic toggle collapse/expand
   *  - Expand: show all children, but check to show/hide children of each child depend on its isCollapsing flag
   *  - Collapse: hide all children and children of each child
   *  Always keep state collapse/expand of children
   */
  const onToggleGroupChild = (
    newTree: TreeData,
    item: IParsedGroup,
    parentCollapsing = false,
    hideChildren = false,
  ) => {
    const { uiId } = item;
    newTree[uiId].hide = parentCollapsing || hideChildren;
    item.childrenUiIds.forEach((childUiId: string) => {
      onToggleGroupChild(
        newTree,
        newTree[childUiId],
        newTree[uiId].isCollapsing,
        hideChildren || newTree[uiId].isCollapsing,
      );
    });
  };

  const onToggleGroup = (group: GroupItemProps) => {
    const newTreeData = { ...treeData };
    const newCollapsing = !group.isCollapsing;
    const { uiId } = group;

    onToggle?.(
      group, newCollapsing,
    );

    newTreeData[uiId].isCollapsing = newCollapsing;
    newTreeData[uiId].childrenUiIds.forEach((childUiId) => {
      onToggleGroupChild(
        newTreeData,
        newTreeData[childUiId],
        newCollapsing,
        newCollapsing,
      );
    });
    setTreeData(newTreeData);
  };

  const onCheckedGroup = (
    group: GroupItemProps, newChecked: boolean,
  ) => {
    const newTreeData = { ...treeData };
    const { uiId } = group;
    newTreeData[uiId].isChecked = newChecked;
    if (onChangeCheckedGroups) {
      const callbackData: OnChangeCheckedGroupsData = {};
      Object.values(newTreeData).forEach((g) => {
        callbackData[g.id] = g.isChecked ? g : false;
      });
      onChangeCheckedGroups(callbackData);
    }
    setTreeData(newTreeData);
  };

  const getItem = (
    group: IGroup,
    treeData: {[x: string]: IParsedGroup},
    uiLevel: number,
    parentUiId: string,
    index: number,
    parentCollapsing = false,
    parentHide = false,
  ) => {
    const childrenUiIds: any = [];
    const collapsed = !!group?.collapsed;
    const hide = parentHide || parentCollapsing;
    const uiId = `${parentUiId}_${index}`;
    group.children?.map((
      child, childIndex,
    ) => childrenUiIds.push(`${uiId}_${childIndex}`));
    treeData[uiId] = {
      ...group,
      uiId,
      parentUiId,
      hide,
      uiLevel,
      isCollapsing: collapsed,
      isChecked: !!selectingData?.[group.id],
      childrenUiIds,
      children: [],
    };
    if (group.children) {
      group.children.map((
        child, index,
      ) => getItem(
        child, treeData, uiLevel + 1, uiId, index, collapsed, hide,
      ));
    }
  };

  const renderTree = () => {
    const tree: React.ReactNode[] = [];
    Object.values(treeData).map((
      group, index,
    ) => tree.push(<GroupItem
      groupStyle={groupStyle}
      key={`tree_item_${index}_${group?.id}`}
      {...group}
      showPrivacy={showPrivacy}
      showPrivacyName={showPrivacyName}
      showPrivacyAvatar={showPrivacyAvatar}
      showInfo={showInfo}
      onPressItem={_onPressGroup}
      onToggleItem={onToggleGroup}
      onCheckedItem={onChangeCheckedGroups ? onCheckedGroup : undefined}
      onPressMenu={onPressMenu}
      disableOnPressItem={disableOnPressItem}
      disableHorizontal={disableHorizontal}
      iconVariant={iconVariant}
      nameLines={nameLines}
      menuIcon={menuIcon}
      renderExtraInfo={renderExtraInfo}
    />));
    setRenderedTree(tree);
  };

  return <View style={styles.container}>{renderedTree}</View>;
};

const createStyle = () => StyleSheet.create({
  container: {
  },
});
export default GroupTree;
