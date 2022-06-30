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
import {IGroup} from '~/interfaces/IGroup';

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
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme || {};
  const styles = createStyle(theme);

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
        leftIconProps={{
          icon: 'Layers',
          size: 24,
          tintColor: disableReorder ? colors.textDisabled : colors.textPrimary,
        }}
        titleProps={{
          color: disableReorder ? colors.textDisabled : colors.textPrimary,
        }}
        title={t('communities:group_structure:title_reorder_group')}
        onPress={disableReorder || !group ? undefined : onPressReorderGroup}
      />
      <PrimaryItem
        testID={'group_structure_menu.reorder'}
        style={styles.item}
        leftIcon={'Exclude'}
        leftIconProps={{
          icon: 'Exclude',
          size: 24,
          tintColor: disableMove ? colors.textDisabled : colors.textPrimary,
        }}
        titleProps={{
          color: disableMove ? colors.textDisabled : colors.textPrimary,
        }}
        title={t('communities:group_structure:title_move_group')}
        onPress={disableMove || !group ? undefined : onPressMoveGroup}
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
