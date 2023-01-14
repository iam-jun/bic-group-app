import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { cloneDeep, debounce, isEmpty } from 'lodash';
import Text from '~/baseComponents/Text';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { IGroup } from '~/interfaces/IGroup';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import AlertAssignGroupConfirmContent from '~/screens/PermissionScheme/GroupSchemeAssignment/components/AlertAssignGroupConfirmContent';
import spacing from '~/theme/spacing';
import usePermissionSchemeStore from '../store';
import { GroupTreeItem } from '~/components/groups';
import useGroupTreeStore from '~/components/groups/store';
import useModalStore from '~/store/modal';

 interface Props {
  route?: {
    params?: {
      communityId: string;
    };
  };
}

const GroupSchemeAssignment = ({ route }: Props) => {
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { showAlert } = useModalStore((state) => state.actions);

  const communityId = route?.params?.communityId;
  const { loading: loadingSchemes, allSchemes } = usePermissionSchemeStore((state) => state.schemes) || {};
  const { loading: loadingAssignments, data: initAssignments }
        = usePermissionSchemeStore((state) => state.assignGroupScheme.assignments) || {};

  const {
    loading: loadingAssigning,
    data: dataAssigning,
    currentAssignments,
  } = usePermissionSchemeStore((state) => state.assignGroupScheme.assigning) || {};

  const actions = usePermissionSchemeStore((state) => state.actions);

  const resetGroupTree = useGroupTreeStore((state) => state.reset);

  const onPressBack = () => {
    if (!isEmpty(dataAssigning)) {
      showAlert({
        title: t('communities:permission:text_title_discard_create_scheme'),
        content: t('communities:permission:text_desc_discard_create_scheme'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('communities:permission:btn_continue'),
        onCancel: rootNavigation.goBack,
      });
    } else {
      rootNavigation.goBack();
    }
  };

  useBackPressListener(onPressBack);

  const disableAssign = loadingSchemes
    || loadingAssignments
    || loadingAssigning
    || isEmpty(dataAssigning);

  useEffect(
    () => {
      if (!loadingSchemes) {
        actions.getSchemes({ communityId });
      }
      if (!loadingAssignments) {
        actions.getGroupSchemeAssignments({ communityId });
      }
      return () => {
        resetGroupTree();
        actions.resetToInitState('assignGroupScheme');
      };
    }, [],
  );

  useEffect(
    () => {
      if (initAssignments) {
        actions.setGroupSchemeAssigning({
          data: [],
          currentAssignments: cloneDeep(initAssignments),
        });
      }
    }, [initAssignments],
  );

  const assignSchemesToGroups = debounce(() => {
    actions.assignSchemesToGroups({
      communityId,
      data: dataAssigning,
      currentAssignments,
    });
  });

  const onPressAssign = () => {
    if (communityId && !isEmpty(dataAssigning)) {
      showAlert({
        title: t('communities:permission:text_title_assign_group_confirm'),
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('communities:permission:btn_assign'),
        onConfirm: assignSchemesToGroups,
        style: { width: '90%' },
        children: <AlertAssignGroupConfirmContent />,
      });
    }
  };

  const onPressGroup = (group: IGroup) => {
    rootNavigation.navigate(
      groupStack.groupSchemeAssignSelection, { group },
    );
  };

  const renderItemExtraInfo = (group: any) => {
    const { schemeId } = group || {};
    if (!schemeId) {
      return null;
    }
    const schemeName = allSchemes?.[schemeId]?.name;
    return (
      <View style={styles.schemeNameContainer}>
        <Text.BodyS numberOfLines={1}>{schemeName}</Text.BodyS>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:permission:title_group_scheme_assignment')}
        onPressButton={onPressAssign}
        onPressBack={onPressBack}
        buttonText="communities:permission:btn_assign"
        buttonProps={{
          loading: loadingAssigning,
          disabled: disableAssign,
          useI18n: true,
          style: { borderWidth: 0 },
          testID: 'group_scheme_assignments.btn_assign',
        }}
      />
      {loadingAssignments || loadingSchemes ? (
        <LoadingIndicator style={{ marginTop: spacing.margin.large }} />
      ) : initAssignments ? (
        currentAssignments && (
          <ScrollView>
            <Text.H5 style={styles.textHeader} useI18n>
              communities:permission:text_list_group
            </Text.H5>
            <GroupTreeItem
              style={styles.item}
              item={currentAssignments}
              menuIcon="AngleRight"
              nameLines={1}
              onPress={onPressGroup}
              onMenuPress={onPressGroup}
              renderItemExtraInfo={renderItemExtraInfo}
            />
          </ScrollView>
        )
      ) : (
        <Text style={styles.textEmpty} useI18n>
          communities:permission:text_data_not_found
        </Text>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    textHeader: {
      margin: spacing.margin.large,
    },
    item: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.margin.base,
    },
    contentContainer: {
      paddingHorizontal: spacing.margin.base,
      backgroundColor: colors.white,
      paddingBottom: spacing.margin.large,
    },
    textEmpty: {
      margin: spacing.padding.large,
      textAlign: 'center',
      color: colors.gray50,
    },
    schemeNameContainer: {
      backgroundColor: colors.neutral1,
      alignSelf: 'flex-start',
      marginVertical: 2,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.pill,
    },
  });
};

export default GroupSchemeAssignment;
