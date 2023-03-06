import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import { useRootNavigation } from '~/hooks/navigation';

import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import useModalStore from '~/store/modal';

export interface GroupStructureMenuProps {
  communityId: string
  group?: IGroup;
  disableMove?: boolean;
  disableReorder?: boolean;
}

const GroupStructureMenu: FC<GroupStructureMenuProps> = ({
  communityId,
  group,
  disableMove,
  disableReorder,
}: GroupStructureMenuProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme || {};
  const modalActions = useModalStore((state) => state.actions);

  const onPressReorderGroup = () => {
    rootNavigation.navigate(
      groupStack.reorderGroup, { group, communityId },
    );
    modalActions.hideModal();
  };

  const onPressMoveGroup = () => {
    rootNavigation.navigate(
      groupStack.moveGroup, { group, communityId },
    );
    modalActions.hideModal();
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID="group_structure_menu.reorder"
        style={styles.item}
        titleProps={{
          useI18n: true,
          variant: 'bodyM',
          color: disableReorder ? colors.gray40 : colors.neutral60,
        }}
        title="communities:group_structure:option_menu:reorder"
        onPress={disableReorder || !group ? undefined : onPressReorderGroup}
      />
      <PrimaryItem
        testID="group_structure_menu.move"
        style={styles.item}
        titleProps={{
          useI18n: true,
          variant: 'bodyM',
          color: disableMove ? colors.gray40 : colors.neutral60,
        }}
        title="communities:group_structure:option_menu:move"
        onPress={disableMove || !group ? undefined : onPressMoveGroup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    paddingVertical: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});

export default GroupStructureMenu;
