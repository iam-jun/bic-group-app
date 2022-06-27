import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import {ITheme} from '~/theme/interfaces';
import {GroupItemProps} from '~/beinComponents/list/items/GroupItem';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import modalActions from '~/store/modal/actions';

export interface GroupStructureMenuProps {
  group: GroupItemProps;
}

const GroupStructureMenu: FC<GroupStructureMenuProps> = ({
  group,
}: GroupStructureMenuProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const getGroup = (id: number | string) => {};

  const onPressReorderGroup = () => {
    rootNavigation.navigate(groupStack.reorderGroup, {group});
    dispatch(modalActions.hideModal());
  };

  const onPressMoveGroup = () => {
    rootNavigation.navigate(groupStack.moveGroup, {group});
    dispatch(modalActions.hideModal());
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID={'group_structure_menu.reorder'}
        style={styles.item}
        leftIcon={'Layers'}
        leftIconProps={{icon: 'Layers', size: 24}}
        title={t('communities:group_structure:title_reorder_group')}
        onPress={onPressReorderGroup}
      />
      <PrimaryItem
        testID={'group_structure_menu.reorder'}
        style={styles.item}
        leftIcon={'Exclude'}
        leftIconProps={{icon: 'Exclude', size: 24}}
        title={t('communities:group_structure:title_move_group')}
        onPress={onPressMoveGroup}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    item: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default GroupStructureMenu;
