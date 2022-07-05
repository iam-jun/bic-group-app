import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {IGroup} from '~/interfaces/IGroup';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import GroupItem, {GroupItemProps} from '~/beinComponents/list/items/GroupItem';
import GroupTree, {OnChangeCheckedGroupsData} from '~/beinComponents/GroupTree';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import mainStack from '~/router/navigator/MainStack/stack';
import {AvatarType} from '~/beinComponents/Avatar/AvatarComponent';

export interface FlatGroupItemProps extends GroupItemProps {
  style?: StyleProp<ViewStyle>;
  groupItemTestID?: string;
  showSmallestChild?: boolean;
  selectingData?: OnChangeCheckedGroupsData;
  onChangeCheckedGroups?: (data: OnChangeCheckedGroupsData) => void;
  toggleOnPress?: boolean;
  onToggle?: (group: IGroup, isCollapse: boolean) => void;
  onPressGroup?: (group: IGroup) => void;
  onPressItem?: (group: IGroup) => void;
  onPressMenu?: (item: GroupItemProps) => void;
  hidePath?: boolean;
  initShowTree?: boolean;
  disableOnPressItem?: boolean;
  disableHorizontal?: boolean;
  iconVariant?: AvatarType;
  nameLines?: number;
}

type PathData = {
  path: string;
  total: number;
  more: number;
};

const limitLength = 45;
const limitLengthShort = 35;

const FlatGroupItem: React.FC<FlatGroupItemProps> = ({
  style,
  groupItemTestID,
  showSmallestChild,
  onChangeCheckedGroups,
  selectingData,
  toggleOnPress,
  onPressGroup,
  onToggle,
  onPressItem,
  onPressMenu,
  hidePath = false,
  initShowTree = true,
  showPrivacy,
  showPrivacyName,
  showInfo,
  disableOnPressItem,
  disableHorizontal,
  iconVariant,
  nameLines,
  ...props
}: FlatGroupItemProps) => {
  const [showTree, setShowTree] = useState(initShowTree);
  const [group, setGroup] = useState<IGroup>(props);
  const [path, setPath] = useState<PathData>({path: '', total: 0, more: 0});

  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const getSmallestChild = (smallestGroup: IGroup, path: PathData) => {
    if (smallestGroup?.children?.[0]) {
      path.total = path.total + 1;
      if (path.path?.length < limitLength) {
        path.path = `${path.path}${path.path?.length > 0 ? ' ▸ ' : ''}${
          smallestGroup.name
        }`;
      } else {
        path.more = path.more + 1;
      }

      getSmallestChild(smallestGroup?.children?.[0], path);
    } else {
      if (path.path?.length >= limitLength) {
        path.path =
          path.path
            .substr(0, path.more > 0 ? limitLengthShort : limitLength)
            ?.trim() + '...';
      }
      setGroup({...smallestGroup});
      setPath({...path});
    }
  };

  const getParentPath = (group: IGroup, path: PathData) => {
    if (group.parent) {
      path.total = path.total + 1;
      path.path = `${group.parent.name}${path.path?.length > 0 ? ' ▸ ' : ''}${
        path.path
      }`;

      getParentPath(group.parent, path);
    } else {
      setPath({...path});
    }
  };

  useEffect(() => {
    if (showSmallestChild) {
      getSmallestChild(props, path);
    } else {
      getParentPath(props, path);
    }
  }, []);

  const onCheckedGroup = (group: GroupItemProps, newChecked: boolean) => {
    if (onChangeCheckedGroups) {
      const callbackData: OnChangeCheckedGroupsData = {};
      callbackData[group.id] = newChecked ? group : false;
      onChangeCheckedGroups(callbackData);
    }
  };

  const _onPressGroup = (group: GroupItemProps) => {
    console.log(`\x1b[35m🐣️ FlatGroupItem _onPressGroup `, group, `\x1b[0m`);
    if (onChangeCheckedGroups) {
      onCheckedGroup(group, !group.isChecked);
    } else if (onPressGroup) {
      onPressGroup(group);
    } else if (onPressItem) {
      onPressItem(group);
    } else {
      if (group.community_id) {
        rootNavigation.navigate(mainStack.communityDetail, {
          communityId: group.community_id,
        });
      } else {
        rootNavigation.navigate(groupStack.groupDetail, {
          groupId: group.id,
          initial: true,
        });
      }
    }
  };

  const _onPressPath = () => {
    if (props?.children && props.children?.length > 0) {
      setShowTree(!showTree);
    }
  };

  const renderPath = () => {
    const hasTree = props?.children && props.children?.length > 0;
    const moreText = path.more > 0 ? `+${path.more} more` : '';
    const buttonText = !hasTree ? '' : showTree ? 'Showless' : moreText;

    if (!path.path) {
      return <View style={styles.pathContainer} />;
    }

    return (
      <View style={styles.pathContainer}>
        <Button onPress={_onPressPath} disabled={!hasTree}>
          <View style={styles.iconArrowRight}>
            <Icon
              icon={'AngleRightB'}
              size={12}
              tintColor={theme.colors.iconTint}
            />
          </View>
          <Text style={{paddingRight: 20}}>
            {showTree ? '' : path.path}{' '}
            <Text color={theme.colors.primary7}>{buttonText}</Text>
          </Text>
        </Button>
      </View>
    );
  };

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {!hidePath && renderPath()}
      {showTree ? (
        <GroupTree
          data={props}
          selectingData={selectingData}
          onChangeCheckedGroups={onChangeCheckedGroups}
          toggleOnPress={toggleOnPress}
          onToggle={onToggle}
          onPressGroup={onPressGroup}
          showPrivacy={showPrivacy}
          showPrivacyName={showPrivacyName}
          showInfo={showInfo}
          onPressMenu={onPressMenu}
          disableOnPressItem={disableOnPressItem}
          disableHorizontal={disableHorizontal}
          iconVariant={iconVariant}
          nameLines={nameLines}
        />
      ) : (
        <GroupItem
          {...(group as GroupItemProps)}
          testID={groupItemTestID}
          isChecked={!!selectingData?.[group.id]}
          onPressItem={_onPressGroup}
          onCheckedItem={onChangeCheckedGroups ? onCheckedGroup : undefined}
          showPrivacy={showPrivacy}
          showPrivacyName={showPrivacyName}
          showInfo={showInfo}
          onPressMenu={onPressMenu}
          disableOnPressItem={disableOnPressItem}
          disableHorizontal={disableHorizontal}
          iconVariant={iconVariant}
          nameLines={nameLines}
        />
      )}
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    iconArrowRight: {
      width: 16,
      height: 16,
      backgroundColor: colors.borderDivider,
      marginRight: spacing.margin.tiny,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pathContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default FlatGroupItem;
