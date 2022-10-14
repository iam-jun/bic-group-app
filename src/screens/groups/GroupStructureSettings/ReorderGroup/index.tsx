import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ReorderList from '~/beinComponents/ReorderList';

import { IGroup } from '~/interfaces/IGroup';
import ReorderGroupHeader from '~/screens/groups/GroupStructureSettings/ReorderGroup/components/ReorderGroupHeader';
import ReorderGroupInfo from '~/screens/groups/GroupStructureSettings/ReorderGroup/components/ReorderGroupInfo';
import ReorderGroupItem, {
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from '~/screens/groups/GroupStructureSettings/ReorderGroup/components/ReorderGroupItem';
import useGroupStructureStore from '../store';

export interface ReorderGroupProps {
  route?: {
    params?: {
      group: IGroup;
      communityId: string;
    };
  };
}

const ReorderGroup: FC<ReorderGroupProps> = ({ route }: ReorderGroupProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const groupStructureActions = useGroupStructureStore((state) => state.actions);

  const initGroup = route?.params?.group;
  const communityId = route?.params?.communityId;
  const children = initGroup?.children || [];

  const initOrder = useMemo(
    () => children?.map?.((g) => g.id), children,
  );

  useEffect(
    () => () => {
      groupStructureActions.setGroupStructureReorder();
    }, [],
  );

  const renderItem = (data: IGroup) => <ReorderGroupItem key={`reorder_item_${data?.id}`} group={data} />;

  const onChange = (newIndex: number[]) => {
    const newOrder = newIndex?.map?.((i: number) => children?.[i]?.id);
    groupStructureActions.setGroupStructureReorder({ newOrder });
  };

  return (
    <View style={styles.container}>
      <ReorderGroupHeader
        communityId={communityId}
        initOrder={initOrder}
        groupName={initGroup?.name}
      />
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    verticalLine: {
      width: 1,
      position: 'absolute',
      top: 8,
      bottom: 8,
      left: 30,
      backgroundColor: colors.gray20,
    },
  });
};

export default ReorderGroup;
