import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {IGroup, IParsedGroup} from '~/interfaces/IGroup';
import GroupItem, {GroupItemProps} from '~/beinComponents/list/items/GroupItem';

export interface GroupTreeProps {
  data: IGroup[];
  reverseData: any[];
}

type TreeData = {[x: string]: IParsedGroup};

const GroupTree: React.FC<GroupTreeProps> = ({
  data,
  reverseData,
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
    onToggleGroup(group);
  };

  const onToggleGroupChild = (
    newTree: TreeData,
    item: IParsedGroup,
    hide: boolean,
  ) => {
    newTree[item.uiId].hide = hide;
    newTree[item.uiId].isCollapsing = hide;
    item.childrenUiIds.map((childUiId: string) => {
      onToggleGroupChild(newTree, newTree[childUiId], hide);
    });
  };

  const onToggleGroup = (group: GroupItemProps) => {
    console.log('\x1b[36m', '🐣️  | onPressGroup : ', group, '\x1b[0m');
    const newTreeData = {...treeData};
    const newCollapsing = !group.isCollapsing;

    newTreeData[group.uiId].isCollapsing = newCollapsing;
    newTreeData[group.uiId].childrenUiIds.map(childUiId => {
      onToggleGroupChild(newTreeData, newTreeData[childUiId], newCollapsing);
    });
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
      checkbox: 'uncheckBox',
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
