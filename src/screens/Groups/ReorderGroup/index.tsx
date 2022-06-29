import React, {FC, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {useBaseHook} from '~/hooks';
import {IGroup} from '~/interfaces/IGroup';
import ReorderList from '~/beinComponents/ReorderList';
import ReorderGroupInfo from '~/screens/Groups/ReorderGroup/components/ReorderGroupInfo';
import ReorderGroupItem, {
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from '~/screens/Groups/ReorderGroup/components/ReorderGroupItem';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import ReorderGroupHeader from '~/screens/Groups/ReorderGroup/components/ReorderGroupHeader';

export interface ReorderGroupProps {
  route?: {
    params?: {
      group: IGroup;
    };
  };
}

const ReorderGroup: FC<ReorderGroupProps> = ({route}: ReorderGroupProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const initGroup = route?.params?.group;
  const children = initGroup?.children || [];

  const initOrder = useMemo(() => {
    return children?.map?.(g => g.id);
  }, children);

  useEffect(() => {
    return () => {
      dispatch(groupsActions.setGroupStructureReorder());
    };
  }, []);

  const renderItem = (data: IGroup) => {
    return <ReorderGroupItem key={`reorder_item_${data?.id}`} group={data} />;
  };

  const onChange = (newIndex: number[]) => {
    const newOrder = newIndex?.map?.((i: number) => children?.[i]?.id);
    dispatch(groupsActions.setGroupStructureReorder({newOrder}));
  };

  return (
    <View style={styles.container}>
      <ReorderGroupHeader initOrder={initOrder} />
      <ReorderGroupInfo group={initGroup as IGroup} />
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
