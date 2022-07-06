import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import Icon from '~/beinComponents/Icon';
import i18n from 'i18next';
import Divider from '~/beinComponents/Divider';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const contentHeight = SCREEN_HEIGHT * 0.4;

const AlertAssignGroupConfirmContent = () => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {allSchemes} =
    useKeySelector(groupsKeySelector.permission.schemes) || {};
  const {data: initAssignments} =
    useKeySelector(
      groupsKeySelector.permission.assignGroupScheme.assignments,
    ) || {};
  const {data: dataAssigning} =
    useKeySelector(groupsKeySelector.permission.assignGroupScheme.assigning) ||
    {};

  const data = useMemo(
    () => prepareData(initAssignments, dataAssigning, allSchemes),
    [initAssignments, dataAssigning, allSchemes],
  );

  console.log(
    `\x1b[34m🐣️ AlertAssignGroupConfirmContent AlertAssignGroupConfirmContent`,
    `${JSON.stringify(data, undefined, 2)}\x1b[0m`,
  );

  const renderItem = (item: any, index: number) => {
    const {groupName, oldSchemeName, newSchemeName} = item || {};
    return (
      <View
        key={`alert_assign_group_confirm.item_${index}`}
        style={styles.itemContainer}>
        <Text.H6>{groupName}</Text.H6>
        <View style={styles.itemContent}>
          <Text.BodyS style={styles.textName} numberOfLines={1}>
            {oldSchemeName}
          </Text.BodyS>
          <Icon style={styles.iconArrow} icon={'ArrowRight'} />
          <Text.BodyS style={styles.textName} numberOfLines={1}>
            {newSchemeName}
          </Text.BodyS>
        </View>
        {index !== data?.length - 1 && <Divider style={styles.divider} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text.BodyS style={styles.textTitle}>
        {t('communities:permission:text_desc_assign_group_confirm')}
      </Text.BodyS>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {data?.map?.(renderItem)}
      </ScrollView>
    </View>
  );
};

export const findGroupInAssignmentsById = (
  groupId: number,
  assignments: any,
) => {
  let result: any;
  const findGroup = (group: any) => {
    if (group?.group_id === groupId) {
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
  assigning?.map?.((item: any) => {
    const {scheme_id, group_id} = item || {};
    const group = findGroupInAssignmentsById(group_id, assignments);
    const groupName = group?.name;
    const oldSchemeName =
      allSchemes?.[group?.scheme_id]?.name ||
      i18n.t('communities:permission:text_unknown_scheme');
    const newSchemeName =
      allSchemes?.[scheme_id]?.name ||
      i18n.t('communities:permission:text_unknown_scheme');
    if (group) {
      result.push({groupName, oldSchemeName, newSchemeName});
    }
  });
  return result;
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
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
};

export default AlertAssignGroupConfirmContent;
