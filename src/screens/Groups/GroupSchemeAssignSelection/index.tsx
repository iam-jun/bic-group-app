import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useRootNavigation} from '~/hooks/navigation';
import {useBaseHook} from '~/hooks';
import {IGroup} from '~/interfaces/IGroup';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import Icon from '~/beinComponents/Icon';
import {isNumber} from 'lodash';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import Animated, {ZoomIn} from 'react-native-reanimated';
import {
  changeSchemeIdOfGroup,
  handleSelectNewGroupScheme,
} from '~/screens/Groups/GroupSchemeAssignSelection/helper';

export interface GroupSchemeManagementProps {
  route?: {
    params?: {
      group: IGroup | any;
    };
  };
}

const GroupSchemeAssignSelection: FC<GroupSchemeManagementProps> = ({
  route,
}: GroupSchemeManagementProps) => {
  const initGroup = route?.params?.group;
  const [selectingIndex, setSelectingIndex] = useState<number>();

  const {data = [], currentAssignments} =
    useKeySelector(groupsKeySelector.permission.assignGroupScheme.assigning) ||
    {};
  const {data: groupAssignments} =
    useKeySelector(
      groupsKeySelector.permission.assignGroupScheme.assignments,
    ) || {};

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const {data: schemes} =
    useKeySelector(groupsKeySelector.permission.schemes) || {};
  const {groupSchemes = []} = schemes || {};

  // @ts-ignore
  const selectingSchemeId = groupSchemes?.[selectingIndex]?.id;
  const disableSave = initGroup?.scheme_id === selectingSchemeId;

  useEffect(() => {
    const index = groupSchemes?.findIndex(
      (item: any) => item?.id === initGroup?.scheme_id,
    );
    if (index !== -1) {
      setSelectingIndex(index);
    }
  }, [groupSchemes]);

  const onPressSave = () => {
    // @ts-ignore
    const schemeId = groupSchemes?.[selectingIndex]?.id || null;
    const groupId = initGroup?.group_id;
    if (groupId) {
      const newData = handleSelectNewGroupScheme(
        groupId,
        schemeId,
        data,
        groupAssignments,
      );
      const newAssignments = changeSchemeIdOfGroup(
        groupId,
        schemeId,
        currentAssignments,
      );
      dispatch(
        groupsActions.setGroupSchemeAssigning({
          data: newData,
          currentAssignments: newAssignments,
        }),
      );
      rootNavigation.goBack();
    }
  };

  const onPressItem = (item: IGroup, index: number) => {
    if (selectingIndex !== index) {
      setSelectingIndex(index);
    } else {
      setSelectingIndex(undefined);
    }
  };

  const renderItem = ({item, index}: {item: IGroup; index: number}) => {
    const isActive = selectingIndex === index;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isActive ? styles.itemContainerActive : {},
        ]}
        onPress={() => onPressItem(item, index)}>
        <Text style={styles.flex1}>{item?.name}</Text>
        <View style={{minWidth: 20, minHeight: 20}}>
          {isActive && (
            <Animated.View entering={ZoomIn}>
              <Icon icon={'Check'} tintColor={colors.primary6} />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return <Text.H5 style={styles.textHeader}>{initGroup?.name}</Text.H5>;
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:permission:title_group_scheme_assign_selection')}
        onPressButton={onPressSave}
        buttonText={'common:btn_save'}
        buttonProps={{
          disabled: disableSave,
          useI18n: true,
          highEmphasis: true,
          style: {borderWidth: 0},
          testID: 'group_scheme_assignments.btn_assign',
        }}
      />
      <FlatList
        data={groupSchemes}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={item => `group_scheme_assignments_item_${item.id}`}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flex: 1,
      backgroundColor: colors.bgHover,
    },
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      padding: spacing.padding.large,
      alignItems: 'center',
    },
    itemContainerActive: {
      backgroundColor: colors.bgSecondary,
    },
    textHeader: {
      margin: spacing.margin.large,
    },
  });
};

export default GroupSchemeAssignSelection;
