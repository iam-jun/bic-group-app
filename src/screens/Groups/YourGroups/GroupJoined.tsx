import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import DropDownMenu from '~/beinComponents/DropDownMenu';

export interface GroupJoinedProps {
  style?: StyleProp<ViewStyle>;
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

const GroupJoined: FC<GroupJoinedProps> = ({style}: GroupJoinedProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const onChangeType = (item: any, index: number) => {
    console.log(
      `\x1b[34m🐣️ GroupJoined onChangeType`,
      `${JSON.stringify(item, undefined, 2)}\x1b[0m`,
    );
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
      <TouchableOpacity
        style={{backgroundColor: colors.borderDivider, flex: 1, width: '100%'}}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};

export default GroupJoined;
