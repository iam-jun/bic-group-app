import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {IGroup, IParsedGroup} from '~/interfaces/IGroup';
import GroupItem, {GroupItemProps} from '~/beinComponents/list/items/GroupItem';

export interface GroupTreeProps {
  data?: IGroup[];
  reverseData?: any[];
  onChangeCheckedGroups?: (data: OnChangeCheckedGroupsData) => void;
}

type TreeData = {[x: string]: IParsedGroup};

export type OnChangeCheckedGroupsData = {[x: string]: boolean};

const GroupTree: React.FC<GroupTreeProps> = ({
  data,
  reverseData,
  onChangeCheckedGroups,
}: GroupTreeProps) => {
  const [treeData, setTreeData] = useState<TreeData>({});
  const [renderedTree, setRenderedTree] = useState<React.ReactNode[]>([]);

  const parseTreeData = () => {
    if (data) {
      const newData: {[x: string]: IParsedGroup} = {};
      data?.map?.((group, index) => getItem(group, newData, 0, 'tree', index));
      setTreeData(newData);
    }
  };

  const parseReverseTreeData = () => {
    if (reverseData) {
      const newData: {[x: string]: IParsedGroup} = {};
      setTreeData(newData);
    }
  };

  useEffect(() => {
    renderTree();
  }, [treeData]);

  useEffect(() => {
    if (data) {
      parseTreeData();
    } else if (reverseData) {
      parseReverseTreeData();
    }
  }, [data, reverseData]);

  const onPressGroup = (group: GroupItemProps) => {
    if (onChangeCheckedGroups) {
      onCheckedGroup(group, !treeData[group.uiId].isChecked);
    } else {
      onToggleGroup(group);
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
      isChecked: false,
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
    console.log(
      '\x1b[33m',
      '🐣 treeData | renderTree : ',
      JSON.stringify(treeData, undefined, 2),
      '\x1b[0m',
    );
    const tree: React.ReactNode[] = [];
    Object.values(treeData).map(group =>
      tree.push(
        <GroupItem
          {...group}
          onPressItem={onPressGroup}
          onToggleItem={onToggleGroup}
          onCheckedItem={onChangeCheckedGroups ? onCheckedGroup : undefined}
        />,
      ),
    );
    setRenderedTree(tree);
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View>{renderedTree}</View>
    </ScrollView>
  );
};

export default GroupTree;
