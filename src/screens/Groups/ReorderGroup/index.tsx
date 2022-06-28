import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {IGroup} from '~/interfaces/IGroup';
import ReorderList from '~/beinComponents/ReorderList';
import ReorderGroupHeader from '~/screens/Groups/ReorderGroup/components/ReorderGroupHeader';
import ReorderGroupItem, {
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from '~/screens/Groups/ReorderGroup/components/ReorderGroupItem';

export interface ReorderGroupProps {
  route?: {
    params?: {
      group: IGroup;
    };
  };
}

const ReorderGroup: FC<ReorderGroupProps> = ({route}: ReorderGroupProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const initGroup = route?.params?.group;
  const children = initGroup?.children || [];

  const renderItem = (data: IGroup) => {
    return <ReorderGroupItem group={data} />;
  };

  const onChange = (newIndex: number[]) => {
    const newOrderIds = newIndex?.map?.((i: number) => children?.[i]?.id);
  };

  return (
    <View style={styles.container}>
      <Header title={t('communities:group_structure:title_reorder_group')} />
      <ReorderGroupHeader group={initGroup as IGroup} />
      <ReorderList
        data={children}
        renderItem={renderItem}
        itemWidth={ITEM_WIDTH}
        itemHeight={ITEM_HEIGHT}
        HeaderComponent={<View style={styles.verticalLine} />}
        onChange={onChange}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    verticalLine: {
      width: 1,
      position: 'absolute',
      top: 8,
      bottom: 8,
      left: 30,
      backgroundColor: colors.bgFocus,
    },
  });
};

export default ReorderGroup;
