import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {IGroup, IParsedGroup} from '~/interfaces/IGroup';
import GroupItem from '~/beinComponents/list/items/GroupItem';

export interface GroupTreeProps {
  data: IGroup[];
  reverseData: any[];
}

const GroupTree: React.FC<GroupTreeProps> = ({
  data,
  reverseData,
}: GroupTreeProps) => {
  const [treeData, setTreeData] = useState<{[x: string]: IParsedGroup}>({});
  const [renderedTree, setRenderedTree] = useState<React.ReactNode[]>([]);

  const parseTreeData = () => {
    if (data) {
      const newData: {[x: string]: IParsedGroup} = {};
      data?.map?.((group, index) => getItem(group, newData, 0, 0, index));
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
    parseTreeData();
  }, [data]);

  useEffect(() => {
    parseReverseTreeData();
  }, [reverseData]);

  const renderTree = () => {
    console.log(
      '\x1b[33m',
      '🐣 treeData | renderTree : ',
      JSON.stringify(treeData, undefined, 2),
      '\x1b[0m',
    );
    const tree: React.ReactNode[] = [];
    Object.values(treeData).map(group => tree.push(<GroupItem {...group} />));
    setRenderedTree(tree);
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

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View>{renderedTree}</View>
    </ScrollView>
  );
};

export default GroupTree;
