import React, { useMemo } from 'react';
import {
  View, StyleSheet, ScrollView, Dimensions, TouchableOpacity,
} from 'react-native';

import i18n from 'i18next';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import Icon from '~/baseComponents/Icon';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const contentHeight = SCREEN_HEIGHT * 0.4;

const AlertAssignGroupConfirmContent = () => {
  const { t } = useBaseHook();

  const { allSchemes } = useKeySelector(groupsKeySelector.permission.schemes) || {};
  const { data: initAssignments } = useKeySelector(groupsKeySelector.permission.assignGroupScheme.assignments) || {};
  const { data: dataAssigning } = useKeySelector(groupsKeySelector.permission.assignGroupScheme.assigning)
    || {};

  const data = useMemo(
    () => prepareData(
      initAssignments, dataAssigning, allSchemes,
    ),
    [initAssignments, dataAssigning, allSchemes],
  );

  const renderItem = (
    item: any, index: number,
  ) => {
    const { groupName, oldSchemeName, newSchemeName } = item || {};
    return (
      <View
        key={`alert_assign_group_confirm.item_${index}`}
        style={styles.itemContainer}
      >
        <Text.H6>{groupName}</Text.H6>
        <View style={styles.itemContent}>
          <Text.BodyS style={styles.textName} numberOfLines={1}>
            {oldSchemeName}
          </Text.BodyS>
          <Icon style={styles.iconArrow} icon="ArrowRight" />
          <Text.BodyS style={styles.textName} numberOfLines={1}>
            {newSchemeName}
          </Text.BodyS>
        </View>
        {index !== (data?.length || 0) - 1 && <Divider style={styles.divider} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text.BodyS style={styles.textTitle}>
        {t('communities:permission:text_desc_assign_group_confirm')}
      </Text.BodyS>
      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity>
            {data?.map?.(renderItem)}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export const findGroupInAssignmentsById = (
  groupId: string,
  assignments: any,
) => {
  let result: any;
  const findGroup = (group: any) => {
    if (group?.groupId === groupId) {
      result = group;
    } else {
      group?.children?.map(findGroup);
    }
  };
  findGroup(assignments);
  return result;
};

export const prepareData = (
  assignments: any,
  assigning: any,
  allSchemes: any,
) => {
  const result: any = [];
  assigning?.forEach?.((item: any) => {
    const { schemeId, groupId } = item || {};
    const group = findGroupInAssignmentsById(groupId, assignments);
    const groupName = group?.name;
    const oldSchemeName = allSchemes?.[group?.schemeId]?.name
      || (group?.schemeId
        ? i18n.t('communities:permission:text_unknown_scheme')
        : i18n.t('communities:permission:text_none_scheme'));
    const newSchemeName = allSchemes?.[schemeId]?.name
      || (schemeId
        ? i18n.t('communities:permission:text_unknown_scheme')
        : i18n.t('communities:permission:text_none_scheme'));
    if (group) {
      result.push({ groupName, oldSchemeName, newSchemeName });
    }
  });
  return result;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.small,
  },
  itemContainer: {
    marginTop: spacing.margin.base,
  },
  contentContainer: {
    height: contentHeight,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.base,
  },
  textName: {
    flex: 1,
  },
  iconArrow: {
    marginHorizontal: spacing.margin.small,
  },
  divider: {
    marginTop: spacing.margin.base,
  },
  textTitle: {
    marginBottom: spacing.margin.small,
  },
});

export default AlertAssignGroupConfirmContent;
