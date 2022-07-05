import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
import {isEmpty, isNumber} from 'lodash';

export interface GroupSchemeManagementProps {
  route?: {
    params?: {
      group: IGroup;
    };
  };
}

const GroupSchemeAssignSelection: FC<GroupSchemeManagementProps> = ({
  route,
}: GroupSchemeManagementProps) => {
  const initGroup = route?.params?.group;
  const [selectingIndex, setSelectingIndex] = useState<number>();

  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const {data: schemes} =
    useKeySelector(groupsKeySelector.permission.schemes) || {};
  const {groupSchemes = []} = schemes || {};

  const onPressSave = () => {
    console.log(`\x1b[36m🐣️ index onPressSave\x1b[0m`);
  };

  const renderItem = ({item, index}: {item: IGroup; index: number}) => {
    const isActive = selectingIndex === index;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isActive ? styles.itemContainerActive : {},
        ]}
        onPress={() => setSelectingIndex(index)}>
        <Text style={styles.flex1}>{item?.name}</Text>
        {isActive && <Icon icon={'Check'} tintColor={colors.primary6} />}
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
          disabled: !isNumber(selectingIndex),
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
