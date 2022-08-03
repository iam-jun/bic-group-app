import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IGroup } from '~/interfaces/IGroup';
import Icon from '~/beinComponents/Icon';
import GroupItem, { GroupItemProps } from '~/beinComponents/list/items/GroupItem';
import GroupTree, { OnChangeCheckedGroupsData } from '~/beinComponents/GroupTree';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import mainStack from '~/router/navigator/MainStack/stack';
import { AvatarType } from '~/beinComponents/Avatar/AvatarComponent';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';

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
  menuIcon?: IconType;
  renderExtraInfo?: (group: IGroup) => any;
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
  showPrivacyAvatar,
  showInfo,
  disableOnPressItem,
  disableHorizontal,
  iconVariant,
  nameLines,
  menuIcon,
  renderExtraInfo,
  ...props
}: FlatGroupItemProps) => {
  const [showTree, setShowTree] = useState(initShowTree);
  const [group, setGroup] = useState<IGroup>(props);
  const [path, setPath] = useState<PathData>({ path: '', total: 0, more: 0 });

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const getSmallestChild = (
    smallestGroup: IGroup, path: PathData,
  ) => {
    if (smallestGroup?.children?.[0]) {
      path.total += 1;
      if (path.path?.length < limitLength) {
        path.path = `${path.path}${path.path?.length > 0 ? ' ▸ ' : ''}${
          smallestGroup.name
        }`;
      } else {
        path.more += 1;
      }

      getSmallestChild(
        smallestGroup?.children?.[0], path,
      );
    } else {
      if (path.path?.length >= limitLength) {
        path.path = `${path.path
          .substr(
            0, path.more > 0 ? limitLengthShort : limitLength,
          )
          ?.trim()}...`;
      }
      setGroup({ ...smallestGroup });
      setPath({ ...path });
    }
  };

  const getParentPath = (
    group: IGroup, path: PathData,
  ) => {
    if (group.parent) {
      path.total += 1;
      path.path = `${group.parent.name}${path.path?.length > 0 ? ' ▸ ' : ''}${
        path.path
      }`;

      getParentPath(
        group.parent, path,
      );
    } else {
      setPath({ ...path });
    }
  };

  useEffect(
    () => {
      if (showSmallestChild) {
        getSmallestChild(
          props, path,
        );
      } else {
        getParentPath(
          props, path,
        );
      }
    }, [],
  );

  const onCheckedGroup = (
    group: GroupItemProps, newChecked: boolean,
  ) => {
    if (onChangeCheckedGroups) {
      const callbackData: OnChangeCheckedGroupsData = {};
      callbackData[group.id] = newChecked ? group : false;
      onChangeCheckedGroups(callbackData);
    }
  };

  const _onPressGroup = (group: GroupItemProps) => {
    if (onChangeCheckedGroups) {
      onCheckedGroup(
        group, !group.isChecked,
      );
    } else if (onPressGroup) {
      onPressGroup(group);
    } else if (onPressItem) {
      onPressItem(group);
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
              icon="AngleRightSolid"
              size={12}
              tintColor={theme.colors.neutral80}
            />
          </View>
          <Text style={{ paddingRight: 20 }}>
            {showTree ? '' : path.path}
            {' '}
            <Text color={theme.colors.purple60}>{buttonText}</Text>
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
          showPrivacyAvatar={showPrivacyAvatar}
          showInfo={showInfo}
          onPressMenu={onPressMenu}
          disableOnPressItem={disableOnPressItem}
          disableHorizontal={disableHorizontal}
          iconVariant={iconVariant}
          nameLines={nameLines}
          menuIcon={menuIcon}
          renderExtraInfo={renderExtraInfo}
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
          showPrivacyAvatar={showPrivacyAvatar}
          showInfo={showInfo}
          onPressMenu={onPressMenu}
          disableOnPressItem={disableOnPressItem}
          disableHorizontal={disableHorizontal}
          iconVariant={iconVariant}
          nameLines={nameLines}
          menuIcon={menuIcon}
          renderExtraInfo={renderExtraInfo}
        />
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {},
    iconArrowRight: {
      width: 16,
      height: 16,
      backgroundColor: colors.neutral5,
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
