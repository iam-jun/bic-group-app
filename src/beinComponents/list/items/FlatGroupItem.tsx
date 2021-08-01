import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {IGroup} from '~/interfaces/IGroup';
import {IObject} from '~/interfaces/common';
import {Text} from '~/components';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import GroupItem, {GroupItemProps} from '~/beinComponents/list/items/GroupItem';
import GroupTree, {OnChangeCheckedGroupsData} from '~/beinComponents/GroupTree';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

export interface FlatGroupItemProps extends GroupItemProps {
  showSmallestChild?: boolean;
  selectingData?: OnChangeCheckedGroupsData;
  onChangeCheckedGroups?: (data: OnChangeCheckedGroupsData) => void;
  toggleOnPress?: boolean;
  onPressGroup?: (group: IGroup) => void;
  onPressItem?: (group: IGroup) => void;
}

const FlatGroupItem: React.FC<FlatGroupItemProps> = ({
  showSmallestChild,
  onChangeCheckedGroups,
  selectingData,
  toggleOnPress,
  onPressGroup,
  onPressItem,
  ...props
}: FlatGroupItemProps) => {
  const [showTree, setShowTree] = useState(false);
  const [group, setGroup] = useState<IGroup>(props);
  const [path, setPath] = useState<string>(props.path || '/');

  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme();
  const {spacing}: IObject<any> = theme;
  const styles = themeStyles(theme);

  const getSmallestChild = (smallestGroup: IGroup, path: string) => {
    if (smallestGroup?.children?.[0]) {
      path = `${path}${smallestGroup.name}/`;
      getSmallestChild(smallestGroup?.children?.[0], path);
    } else {
      setGroup({...smallestGroup});
      setPath(path);
    }
  };

  useEffect(() => {
    if (showSmallestChild) {
      getSmallestChild(props, path);
    }
  }, []);

  const onCheckedGroup = (group: GroupItemProps, newChecked: boolean) => {
    if (onChangeCheckedGroups) {
      const callbackData: OnChangeCheckedGroupsData = {};
      callbackData[group.id] = newChecked;
      onChangeCheckedGroups(callbackData);
    }
  };

  const _onPressGroup = (group: GroupItemProps) => {
    if (onChangeCheckedGroups) {
      onCheckedGroup(group, !group.isChecked);
    } else if (onPressGroup) {
      onPressGroup(group);
    } else if (onPressItem) {
      onPressItem(group);
    } else {
      rootNavigation.navigate(groupStack.groupDetail, group as any);
    }
  };

  const _onPressPath = () => {
    if (props?.children && props.children?.length > 0) {
      setShowTree(!showTree);
    }
  };

  const getGroupParent = (group: IGroup, parents: IGroup[]) => {
    parents.push(group);
    if (group.parent) {
      getGroupParent(group.parent, parents);
    }
  };

  const renderPath = () => {
    return (
      <TouchableOpacity
        // style={{marginHorizontal: spacing.margin.tiny}}
        disabled={!(props?.children && props.children?.length > 0)}
        onPress={_onPressPath}>
        <Text>{path}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: spacing.margin.tiny, flexDirection: 'row'}}>
        <View style={styles.iconNextContainer}>
          <Icon
            icon={'AngleRightB'}
            size={12}
            tintColor={theme.colors.iconTint}
          />
        </View>
        {renderPath()}
      </View>
      {showTree ? (
        <GroupTree
          data={props}
          selectingData={selectingData}
          onChangeCheckedGroups={onChangeCheckedGroups}
          toggleOnPress={toggleOnPress}
          onPressGroup={onPressGroup}
        />
      ) : (
        <GroupItem
          {...(group as GroupItemProps)}
          isChecked={selectingData?.[group.id] || false}
          onPressItem={_onPressGroup}
          onCheckedItem={onChangeCheckedGroups ? onCheckedGroup : undefined}
        />
      )}
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    iconNextContainer: {
      width: 16,
      height: 16,
      marginTop: 4,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default FlatGroupItem;
