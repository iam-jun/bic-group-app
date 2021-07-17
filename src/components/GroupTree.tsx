import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import mockGetJoinedGroups from "~/screens/Groups/mocks/getJoinedGroups";
import GroupItem from "~/components/GroupItem";
import {IGroup} from "~/interfaces/IGroup";

const GroupTree = ({ data = mockGetJoinedGroups.data}:any) => {
    const [renderedTree, setRenderedTree] = useState([]);

    useEffect(() => {
        renderTree();
    }, [data]);

    const renderTree = () => {
        const tree:any[] = [];
        data.map((group:IGroup) => getItem(group, 0, tree));
        // @ts-ignore
        setRenderedTree(tree);
    }

    const getItem = (group:IGroup, level:number, tree:any[]) => {
        tree.push(<GroupItem level={level} {...group} />)
        if (group.children) {
            group.children.map(child => getItem(child, level+1, tree));
        }
    };

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
                {renderedTree}
            </View>
        </ScrollView>
    );
};

export default GroupTree;
