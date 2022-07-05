import React, {FC, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {isEmpty} from 'lodash';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import FlatGroupItem from '~/beinComponents/list/items/FlatGroupItem';
import {IGroup} from '~/interfaces/IGroup';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface GroupSchemeAssignmentProps {
  style?: StyleProp<ViewStyle>;
}

const GroupSchemeAssignment: FC<GroupSchemeAssignmentProps> = ({
  style,
}: GroupSchemeAssignmentProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {loadingSchemes, allSchemes} =
    useKeySelector(groupsKeySelector.permission.schemes) || {};
  const {loading: loadingAssignments, data: dataAssignments} =
    useKeySelector(
      groupsKeySelector.permission.assignGroupScheme.assignments,
    ) || {};
  const {loading: loadingAssigning, data: dataAssigning} =
    useKeySelector(groupsKeySelector.permission.assignGroupScheme.assigning) ||
    {};

  const disableAssign =
    loadingSchemes || loadingAssignments || loadingAssigning;

  useEffect(() => {
    if (!loadingSchemes && isEmpty(allSchemes)) {
      dispatch(groupsActions.getSchemes({communityId}));
    }
    if (!loadingAssignments && isEmpty(dataAssignments)) {
      dispatch(groupsActions.getGroupSchemeAssignments({communityId}));
    }
  }, []);

  const onPressAssign = () => {
    alert('ok');
  };

  const onPressGroup = (group: IGroup) => {
    rootNavigation.navigate(groupStack.groupSchemeAssignSelection, {group});
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('communities:permission:title_group_scheme_assignment')}
        onPressButton={onPressAssign}
        buttonText={'communities:permission:btn_assign'}
        buttonProps={{
          loading: loadingAssigning,
          disabled: disableAssign,
          useI18n: true,
          highEmphasis: true,
          style: {borderWidth: 0},
          testID: 'group_scheme_assignments.btn_assign',
        }}
      />
      {loadingAssignments || loadingSchemes ? (
        <LoadingIndicator style={{marginTop: spacing.margin.large}} />
      ) : !!dataAssignments ? (
        <ScrollView>
          <Text.H5 style={styles.textHeader} useI18n>
            communities:permission:text_list_group
          </Text.H5>

          <View style={styles.contentContainer}>
            <FlatGroupItem
              {...dataAssignments}
              onPressGroup={onPressGroup}
              disableHorizontal
              showInfo={false}
              onPressMenu={onPressGroup}
              iconVariant={'small'}
              nameLines={1}
              menuIcon={'AngleRight'}
            />
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.textEmpty} useI18n>
          communities:permission:text_data_not_found
        </Text>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgHover,
    },
    textHeader: {
      margin: spacing.margin.large,
    },
    contentContainer: {
      paddingHorizontal: spacing.margin.base,
      backgroundColor: colors.background,
      paddingBottom: spacing.margin.large,
    },
    textEmpty: {
      margin: spacing.padding.large,
      textAlign: 'center',
      color: colors.textSecondary,
    },
  });
};

export default GroupSchemeAssignment;
