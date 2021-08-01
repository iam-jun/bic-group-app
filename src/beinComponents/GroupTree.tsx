import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {isArray, isObject} from 'lodash';

import {IGroup, IParsedGroup} from '~/interfaces/IGroup';
import GroupItem, {GroupItemProps} from '~/beinComponents/list/items/GroupItem';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

export interface GroupTreeProps {
  data?: IGroup[] | IGroup;
  selectingData?: OnChangeCheckedGroupsData;
  onChangeCheckedGroups?: (data: OnChangeCheckedGroupsData) => void;
  toggleOnPress?: boolean;
  onPressGroup?: (group: IGroup) => void;
}

type TreeData = {[x: string]: IParsedGroup};

export type OnChangeCheckedGroupsData = {[x: string]: boolean};

const GroupTree: React.FC<GroupTreeProps> = ({
  data,
  selectingData,
  onChangeCheckedGroups,
  onPressGroup,
  toggleOnPress,
}: GroupTreeProps) => {
  const [treeData, setTreeData] = useState<TreeData>({});
  const [renderedTree, setRenderedTree] = useState<React.ReactNode[]>([]);

  const {rootNavigation} = useRootNavigation();
  const styles = createStyle();

  const parseTreeData = () => {
    const newData: {[x: string]: IParsedGroup} = {};
    if (isArray(data)) {
      data?.map?.((group, index) => getItem(group, newData, 0, 'tree', index));
      setTreeData(newData);
    } else if (isObject(data)) {
      getItem(data, newData, 0, 'tree', 0);
      setTreeData(newData);
    } else {
      console.log('\x1b[31m', '🐣️ parse tree data: unknown ', data, '\x1b[0m');
    }
  };

  useEffect(() => {
    renderTree();
  }, [treeData]);

  useEffect(() => {
    if (data) {
      parseTreeData();
    }
  }, [data]);

  const _onPressGroup = (group: GroupItemProps) => {
    if (onChangeCheckedGroups) {
      onCheckedGroup(group, !treeData[group.uiId].isChecked);
    } else if (onPressGroup) {
      onPressGroup(group);
    } else if (toggleOnPress) {
      onToggleGroup(group);
    } else {
      rootNavigation.navigate(groupStack.groupDetail, group as any);
    }
  };

  /**
   * Logic toggle collapse/expand
   *  - Expand: expand and show all children and below
   *  - Collapse: hide all children and below
   */
  const onToggleGroupChild = (
    newTree: TreeData,
    item: IParsedGroup,
    hide: boolean,
  ) => {
    const uiId = item.uiId;
    newTree[uiId].hide = hide;
    newTree[uiId].isCollapsing = hide;
    item.childrenUiIds.map((childUiId: string) => {
      onToggleGroupChild(newTree, newTree[childUiId], hide);
    });
  };

  const onToggleGroup = (group: GroupItemProps) => {
    const newTreeData = {...treeData};
    const newCollapsing = !group.isCollapsing;
    const uiId = group.uiId;

    newTreeData[uiId].isCollapsing = newCollapsing;
    newTreeData[uiId].childrenUiIds.map(childUiId => {
      onToggleGroupChild(newTreeData, newTreeData[childUiId], newCollapsing);
    });
    setTreeData(newTreeData);
  };

  /**
   * Logic:
   *  - If child uncheck => auto uncheck parent and above
   *  - If parent check => DO NOT check children
   */
  const onCheckedGroupParent = (
    newTree: TreeData,
    group: IParsedGroup,
    newChecked: boolean,
  ) => {
    const uiUd = group.parentUiId;
    if (!newTree[uiUd]) {
      return;
    }
    newTree[uiUd].isChecked = newChecked;
    onCheckedGroupParent(newTree, newTree[uiUd], newChecked);
  };

  const onCheckedGroup = (group: GroupItemProps, newChecked: boolean) => {
    const newTreeData = {...treeData};
    const uiId = group.uiId;
    newTreeData[uiId].isChecked = newChecked;
    if (!newChecked) {
      onCheckedGroupParent(newTreeData, group, newChecked);
    }
    if (onChangeCheckedGroups) {
      const callbackData: OnChangeCheckedGroupsData = {};
      Object.values(newTreeData).map(g => {
        callbackData[g.id] = g.isChecked;
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
  ) => {
    const childrenUiIds: any = [];
    const uiId = `${parentUiId}_${index}`;
    group.children?.map((child, childIndex) =>
      childrenUiIds.push(`${uiId}_${childIndex}`),
    );
    treeData[uiId] = {
      ...group,
      uiId,
      parentUiId,
      hide: false,
      uiLevel: uiLevel,
      isCollapsing: false,
      isChecked: selectingData?.[group.id] || false,
      childrenUiIds,
      children: [],
    };
    if (group.children) {
      group.children.map((child, index) =>
        getItem(child, treeData, uiLevel + 1, uiId, index),
      );
    }
  };

  const renderTree = () => {
    const tree: React.ReactNode[] = [];
    Object.values(treeData).map(group =>
      tree.push(
        <GroupItem
          {...group}
          onPressItem={_onPressGroup}
          onToggleItem={onToggleGroup}
          onCheckedItem={onChangeCheckedGroups ? onCheckedGroup : undefined}
        />,
      ),
    );
    setRenderedTree(tree);
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>{renderedTree}</View>
    </ScrollView>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    container: {
      minHeight: 51,
    },
  });
};
export default GroupTree;
