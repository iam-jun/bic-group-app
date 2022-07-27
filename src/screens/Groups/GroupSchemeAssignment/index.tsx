import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { cloneDeep, debounce, isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import Animated, { FadeIn, LightSpeedInLeft } from 'react-native-reanimated';
import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import { useBaseHook } from '~/hooks';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import { IGroup } from '~/interfaces/IGroup';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import modalActions from '~/store/modal/actions';
import AlertAssignGroupConfirmContent from '~/screens/Groups/GroupSchemeAssignment/components/AlertAssignGroupConfirmContent';
import spacing from '~/theme/spacing';

const GroupSchemeAssignment = () => {
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { id: communityId } = useKeySelector(groupsKeySelector.communityDetail);
  const { loadingSchemes, allSchemes } = useKeySelector(groupsKeySelector.permission.schemes) || {};
  const { loading: loadingAssignments, data: initAssignments }
        = useKeySelector(groupsKeySelector.permission.assignGroupScheme.assignments) || {};

  const {
    loading: loadingAssigning,
    data: dataAssigning,
    currentAssignments,
  } = useKeySelector(groupsKeySelector.permission.assignGroupScheme.assigning) || {};

  const onPressBack = () => {
    if (!isEmpty(dataAssigning)) {
      dispatch(modalActions.showAlert({
        title: t('communities:permission:text_title_discard_create_scheme'),
        content: t('communities:permission:text_desc_discard_create_scheme'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('communities:permission:btn_continue'),
        cancelBtnProps: {
          textColor: theme.colors.neutral80,
        },
        onCancel: rootNavigation.goBack,
      }));
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
        dispatch(groupsActions.getSchemes({ communityId }));
      }
      if (!loadingAssignments) {
        dispatch(groupsActions.getGroupSchemeAssignments({ communityId }));
      }
      return () => {
        dispatch(groupsActions.setGroupSchemeAssignments());
        dispatch(groupsActions.setGroupSchemeAssigning());
      };
    }, [],
  );

  useEffect(
    () => {
      if (initAssignments) {
        dispatch(groupsActions.setGroupSchemeAssigning({
          data: [],
          currentAssignments: cloneDeep(initAssignments),
        }));
      }
    }, [initAssignments],
  );

  const putGroupSchemeAssignments = debounce(() => {
    dispatch(groupsActions.putGroupSchemeAssignments({
      communityId,
      data: dataAssigning,
      currentAssignments,
    }));
  });

  const onPressAssign = () => {
    if (communityId && !isEmpty(dataAssigning)) {
      dispatch(modalActions.showAlert({
        title: t('communities:permission:text_title_assign_group_confirm'),
        cancelBtn: true,
        cancelLabel: t('common:btn_cancel'),
        confirmLabel: t('communities:permission:btn_assign'),
        onConfirm: putGroupSchemeAssignments,
        style: { width: '90%' },
        children: <AlertAssignGroupConfirmContent />,
      }));
    }
  };

  const onPressGroup = (group: IGroup) => {
    rootNavigation.navigate(
      groupStack.groupSchemeAssignSelection, { group },
    );
  };

  const renderItemExtraInfo = (group: any) => {
    const { scheme_id } = group || {};
    if (!scheme_id) {
      return null;
    }
    const schemeName = allSchemes?.[scheme_id]?.name;
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
          highEmphasis: true,
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
            <Animated.View style={styles.contentContainer} entering={FadeIn}>
              <FlatGroupItem
                style={{ backgroundColor: colors.white }}
                {...currentAssignments}
                onPressGroup={onPressGroup}
                disableHorizontal
                showInfo={false}
                onPressMenu={onPressGroup}
                iconVariant="small"
                nameLines={1}
                menuIcon="AngleRight"
                entering={LightSpeedInLeft}
                renderExtraInfo={renderItemExtraInfo}
              />
            </Animated.View>
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
      backgroundColor: colors.gray40,
    },
    textHeader: {
      margin: spacing.margin.large,
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
      borderRadius: spacing.borderRadius.large,
    },
  });
};

export default GroupSchemeAssignment;
