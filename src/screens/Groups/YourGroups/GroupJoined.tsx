import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import DropDownMenu from '~/beinComponents/DropDownMenu';
import {useDispatch} from 'react-redux';
import GroupJoinedTree from '~/screens/Groups/YourGroups/GroupJoinedTree';
import GroupJoinedList from '~/screens/Groups/YourGroups/GroupJoinedList';

export interface GroupJoinedProps {
  style?: StyleProp<ViewStyle>;
  communityId: number;
}

const menuType = [
  {
    title: 'communities:group_types:text_tree_view',
    icon: 'Sitemap',
    type: 'tree',
  },
  {
    title: 'communities:group_types:text_flat_list',
    icon: 'ListUl',
    type: 'flat',
  },
];

const GroupJoined: FC<GroupJoinedProps> = ({communityId}: GroupJoinedProps) => {
  const [isModeTree, setIsModeTree] = useState(true);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const onChangeType = (item: any) => {
    setIsModeTree(item?.type === 'tree');
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.padding.small,
          paddingHorizontal: spacing.padding.small,
        }}>
        <Text.H5
          useI18n
          color={colors.textSecondary}
          style={{marginLeft: spacing.margin.small}}>
          communities:text_view_mode
        </Text.H5>
        <DropDownMenu initIndex={0} data={menuType} onChange={onChangeType} />
      </View>
      {isModeTree ? (
        <GroupJoinedTree communityId={communityId} />
      ) : (
        <GroupJoinedList communityId={communityId} />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    dataList: {
      marginLeft: spacing.margin.base,
      marginRight: spacing.margin.large,
    },
  });
};

export default GroupJoined;
