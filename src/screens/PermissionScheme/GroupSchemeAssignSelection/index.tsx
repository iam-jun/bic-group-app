import React, { FC, useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import Text from '~/baseComponents/Text';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import { IGroup } from '~/interfaces/IGroup';
import Icon from '~/baseComponents/Icon';
import {
  changeSchemeIdOfGroup,
  handleSelectNewGroupScheme,
} from '~/screens/PermissionScheme/GroupSchemeAssignSelection/helper';
import spacing from '~/theme/spacing';
import usePermissionSchemeStore from '../store';

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

  const actions = usePermissionSchemeStore((state) => state.actions);
  const { data = [], currentAssignments } = usePermissionSchemeStore((state) => state.assignGroupScheme.assigning)
    || {};
  const { data: groupAssignments } = usePermissionSchemeStore((state) => state.assignGroupScheme.assignments) || {};
  const { data: schemes } = usePermissionSchemeStore((state) => state.schemes) || {};
  const { groupSchemes = [] } = schemes || {};

  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  useEffect(() => {
    const index = groupSchemes?.findIndex(
      (item: any) => item?.id === initGroup?.schemeId,
    );
    if (index !== -1) {
      setSelectingIndex(index);
    }
  }, [groupSchemes]);

  const updateCurrentAssigningSchemesTree = (currentIndex?: number) => {
    const schemeId = groupSchemes?.[currentIndex]?.id || null;
    const groupId = initGroup?.groupId;

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
      actions.setGroupSchemeAssigning({
        data: newData,
        currentAssignments: newAssignments,
      });
    }
  };

  const onPressItem = (_item: IGroup, index: number) => {
    const currentIndex = selectingIndex === index ? undefined : index;
    setSelectingIndex(currentIndex);
    updateCurrentAssigningSchemesTree(currentIndex);
  };

  const renderItem = ({ item, index }: {item: IGroup; index: number}) => {
    const isActive = selectingIndex === index;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isActive ? styles.itemContainerActive : {},
        ]}
        onPress={() => onPressItem(
          item, index,
        )}
      >
        <Text style={styles.flex1}>{item?.name}</Text>
        <View style={{ minWidth: 20, minHeight: 20 }}>
          {isActive && (
            <Animated.View entering={ZoomIn}>
              <Icon icon="Check" tintColor={colors.purple50} />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => <Text.H5 style={styles.textHeader}>{initGroup?.name}</Text.H5>;

  return (
    <View style={styles.container}>
      <Header title={t('communities:permission:title_group_scheme_assign_selection')} />
      <FlatList
        data={groupSchemes}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => `group_scheme_assignments_item_${item.id}`}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      padding: spacing.padding.large,
      alignItems: 'center',
    },
    itemContainerActive: {
      backgroundColor: colors.neutral1,
    },
    textHeader: {
      margin: spacing.margin.large,
    },
  });
};

export default GroupSchemeAssignSelection;
