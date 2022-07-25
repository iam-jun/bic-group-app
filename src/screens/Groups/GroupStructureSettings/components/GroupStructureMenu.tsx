import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';

import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import modalActions from '~/store/modal/actions';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';

export interface GroupStructureMenuProps {
  group?: IGroup;
  disableMove?: boolean;
  disableReorder?: boolean;
}

const GroupStructureMenu: FC<GroupStructureMenuProps> = ({
  group,
  disableMove,
  disableReorder,
}: GroupStructureMenuProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};

  const onPressReorderGroup = () => {
    rootNavigation.navigate(groupStack.reorderGroup, { group });
    dispatch(modalActions.hideModal());
  };

  const onPressMoveGroup = () => {
    rootNavigation.navigate(groupStack.moveGroup, { group });
    dispatch(modalActions.hideModal());
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID="group_structure_menu.reorder"
        style={styles.item}
        leftIcon="LayerGroup"
        leftIconProps={{
          icon: 'LayerGroup',
          size: 24,
          tintColor: disableReorder ? colors.gray40 : colors.neutral80,
        }}
        titleProps={{
          color: disableReorder ? colors.gray40 : colors.neutral80,
        }}
        title={t('communities:group_structure:title_reorder_group')}
        onPress={disableReorder || !group ? undefined : onPressReorderGroup}
      />
      <PrimaryItem
        testID="group_structure_menu.reorder"
        style={styles.item}
        leftIcon="ObjectExclude"
        leftIconProps={{
          icon: 'ObjectExclude',
          size: 24,
          tintColor: disableMove ? colors.gray40 : colors.neutral80,
        }}
        titleProps={{
          color: disableMove ? colors.gray40 : colors.neutral80,
        }}
        title={t('communities:group_structure:title_move_group')}
        onPress={disableMove || !group ? undefined : onPressMoveGroup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    height: 44,
    paddingHorizontal: spacing.padding.large,
  },
});

export default GroupStructureMenu;
